/**
 * 速率限制工具函数
 */

/**
 * 检查请求是否超过速率限制
 * @param {Request} request - HTTP请求对象
 * @param {D1Database} db - D1数据库实例
 * @param {number} limit - 时间窗口内允许的最大请求数
 * @param {number} windowSeconds - 时间窗口大小（秒）
 * @returns {Promise<{isLimited: boolean, remaining: number, resetTime: number}>} 限流检查结果
 */
export async function checkRateLimit(request, db, limit = 60, windowSeconds = 60) {
  try {
    const ip = request.headers.get('CF-Connecting-IP') || request.headers.get('X-Forwarded-For') || 'unknown';
    const now = Math.floor(Date.now() / 1000);
    const windowStart = now - windowSeconds;
    
    // 清除过期的请求记录
    await db.prepare(
      `DELETE FROM rate_limits WHERE ip = ? AND timestamp < ?`
    ).bind(ip, windowStart).run();
    
    // 计算当前窗口内的请求数
    const result = await db.prepare(
      `SELECT COUNT(*) as count FROM rate_limits WHERE ip = ?`
    ).bind(ip).first();
    
    const currentCount = result.count || 0;
    const remaining = Math.max(0, limit - currentCount);
    const isLimited = currentCount >= limit;
    const resetTime = now + windowSeconds;
    
    if (!isLimited) {
      // 记录新请求
      await db.prepare(
        `INSERT INTO rate_limits (ip, timestamp) VALUES (?, ?)`
      ).bind(ip, now).run();
    }
    
    return {
      isLimited,
      remaining,
      resetTime
    };
  } catch (error) {
    // 如果数据库操作失败，暂时不进行限流
    console.error('Rate limit check failed:', error);
    return {
      isLimited: false,
      remaining: limit,
      resetTime: Math.floor(Date.now() / 1000) + windowSeconds
    };
  }
}

/**
 * 添加速率限制响应头
 * @param {Response} response - 原始响应对象
 * @param {object} rateLimitInfo - 速率限制信息
 * @returns {Response} 添加了限流头的响应对象
 */
export function addRateLimitHeaders(response, rateLimitInfo) {
  const headers = new Headers(response.headers);
  headers.set('X-RateLimit-Limit', '60');
  headers.set('X-RateLimit-Remaining', rateLimitInfo.remaining.toString());
  headers.set('X-RateLimit-Reset', rateLimitInfo.resetTime.toString());
  
  return new Response(response.body, {
    status: response.status,
    headers: headers
  });
}