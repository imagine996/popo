/**
 * 响应相关工具函数
 */

/**
 * 生成成功响应
 * @param {object} data - 响应数据
 * @param {number} statusCode - HTTP状态码，默认为200
 * @returns {Response} 成功响应对象
 */
export function successResponse(data, statusCode = 200) {
  return new Response(JSON.stringify(data), {
    status: statusCode,
    headers: {
      'Content-Type': 'application/json'
    }
  });
}

/**
 * 生成错误响应
 * @param {string} errorMessage - 错误信息
 * @param {number} statusCode - HTTP状态码，默认为400
 * @returns {Response} 错误响应对象
 */
export function errorResponse(errorMessage, statusCode = 400) {
  return new Response(JSON.stringify({ error: errorMessage }), {
    status: statusCode,
    headers: {
      'Content-Type': 'application/json'
    }
  });
}

/**
 * 生成CORS响应头
 * @param {Request} request - HTTP请求对象
 * @returns {object} CORS响应头
 */
export function generateCorsHeaders(request) {
  const origin = request.headers.get('Origin');
  const allowedOrigins = ['http://localhost:5173', 'http://localhost:8788', 'https://your-production-domain.com'];
  
  let allowedOrigin = 'http://localhost:5173';
  if (origin && allowedOrigins.includes(origin)) {
    allowedOrigin = origin;
  }
  
  return {
    'Access-Control-Allow-Origin': allowedOrigin,
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Allow-Credentials': 'true'
  };
}

/**
 * 处理OPTIONS请求
 * @param {Request} request - HTTP请求对象
 * @returns {Response} OPTIONS响应对象
 */
export function handleOptionsRequest(request) {
  const corsHeaders = generateCorsHeaders(request);
  return new Response(null, {
    status: 204,
    headers: corsHeaders
  });
}