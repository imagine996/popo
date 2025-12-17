import { verifyJWT, extractTokenFromRequest } from './utils/auth.js';
import { errorResponse, generateCorsHeaders, handleOptionsRequest } from './utils/response.js';
import { checkRateLimit, addRateLimitHeaders } from './utils/rate-limiter.js';

export async function onRequest(context) {
  const { request, next, env } = context;
  const url = new URL(request.url);
  
  // 处理OPTIONS请求
  if (request.method === 'OPTIONS') {
    return handleOptionsRequest(request);
  }

  // 允许公开访问的路由
  const publicRoutes = [
    '/api/register',
    '/api/login'
  ];
  
  // 检查速率限制（所有路由）
  const rateLimitInfo = await checkRateLimit(request, env.DB);
  
  if (rateLimitInfo.isLimited) {
    let response = errorResponse('请求频率过高，请稍后再试', 429);
    response = addRateLimitHeaders(response, rateLimitInfo);
    return response;
  }

  // 如果是公开路由，直接放行
  if (publicRoutes.includes(url.pathname)) {
    let response = await next();
    response = addRateLimitHeaders(response, rateLimitInfo);
    return response;
  }

  // 提取并验证令牌
  const token = extractTokenFromRequest(request);
  if (!token) {
    let response = errorResponse('未授权访问', 401);
    response = addRateLimitHeaders(response, rateLimitInfo);
    return response;
  }

  const decoded = await verifyJWT(token, env.JWT_SECRET);
  if (!decoded) {
    let response = errorResponse('无效的令牌', 401);
    response = addRateLimitHeaders(response, rateLimitInfo);
    return response;
  }

  // 将用户信息添加到上下文
  context.data = context.data || {};
  context.data.user = decoded;

  // 执行后续处理
  let response = await next();
  
  // 添加速率限制头
  response = addRateLimitHeaders(response, rateLimitInfo);
  
  // 添加CORS头
  const corsHeaders = generateCorsHeaders(request);
  const headers = new Headers(response.headers);
  
  for (const [key, value] of Object.entries(corsHeaders)) {
    headers.set(key, value);
  }
  
  return new Response(response.body, {
    status: response.status,
    headers: headers
  });
}