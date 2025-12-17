import { successResponse, errorResponse } from '../utils/response.js';

/**
 * 生成随机API密钥
 * @returns {string} 随机API密钥
 */
function generateApiKey() {
  const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let key = 'sk-';
  for (let i = 0; i < 32; i++) {
    key += charset.charAt(Math.floor(Math.random() * charset.length));
  }
  return key;
}

export async function onRequestGet(context) {
  const { env, data } = context;
  const userId = data.user.sub;
  
  // 查询用户的API密钥
  const apiKeys = await env.DB.prepare(
    "SELECT id, key, name, is_active, created_at FROM api_keys WHERE user_id = ? ORDER BY created_at DESC"
  ).bind(userId).all();
  
  return successResponse({ apiKeys: apiKeys.results });
}

export async function onRequestPost(context) {
  const { request, env, data } = context;
  const userId = data.user.sub;
  const { name } = await request.json();
  
  // 生成新的API密钥
  const newKey = generateApiKey();
  
  // 插入API密钥到数据库
  await env.DB.prepare(
    "INSERT INTO api_keys (user_id, key, name, is_active) VALUES (?, ?, ?, ?)"
  ).bind(userId, newKey, name || 'Default Key', 1).run();
  
  return successResponse({ message: "API密钥创建成功", key: newKey });
}

export async function onRequestDelete(context) {
  const { request, env, data } = context;
  const userId = data.user.sub;
  const url = new URL(request.url);
  const keyId = url.searchParams.get('id');
  
  if (!keyId) {
    return errorResponse("缺少API密钥ID", 400);
  }
  
  // 删除API密钥
  const result = await env.DB.prepare(
    "DELETE FROM api_keys WHERE id = ? AND user_id = ?"
  ).bind(keyId, userId).run();
  
  if (result.meta.changes === 0) {
    return errorResponse("API密钥不存在或无权限删除", 404);
  }
  
  return successResponse({ message: "API密钥删除成功" });
}