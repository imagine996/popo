import { successResponse, errorResponse } from '../utils/response.js';

export async function onRequestGet(context) {
  const { env, data } = context;
  const userId = data.user.sub;
  
  // 查询用户信息
  const user = await env.DB.prepare(
    "SELECT id, username, email, created_at FROM users WHERE id = ?"
  ).bind(userId).first();
  
  if (!user) {
    return errorResponse("用户不存在", 404);
  }
  
  // 查询用户配额
  const quota = await env.DB.prepare(
    "SELECT total_credits, used_credits FROM user_quota WHERE user_id = ?"
  ).bind(userId).first();
  
  return successResponse({
    user: {
      id: user.id,
      username: user.username,
      email: user.email,
      created_at: user.created_at
    },
    quota: quota || { total_credits: 0, used_credits: 0 }
  });
}

export async function onRequestPost(context) {
  const { request, env, data } = context;
  const userId = data.user.sub;
  const { email, name } = await request.json();
  
  // 更新用户信息
  await env.DB.prepare(
    "UPDATE users SET email = ?, name = ? WHERE id = ?"
  ).bind(email || null, name || null, userId).run();
  
  return successResponse({ message: "用户信息更新成功" });
}