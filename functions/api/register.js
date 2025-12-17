import { hashPassword } from '../utils/auth.js';
import { successResponse, errorResponse } from '../utils/response.js';

export async function onRequestPost(context) {
  const { request, env } = context;
  const { username, password } = await request.json();

  // 1. 检查用户是否存在
  const existingUser = await env.DB.prepare("SELECT * FROM users WHERE username = ?")
    .bind(username)
    .first();

  if (existingUser) {
    return errorResponse("用户已存在");
  }

  // 2. 密码哈希处理
  const hashedPassword = await hashPassword(password);

  // 3. 插入用户数据
  const result = await env.DB.prepare("INSERT INTO users (username, password) VALUES (?, ?)")
    .bind(username, hashedPassword)
    .run();

  // 4. 为新用户创建配额记录
  const userId = result.meta.last_row_id;
  await env.DB.prepare("INSERT INTO user_quota (user_id, total_credits, used_credits) VALUES (?, ?, ?)")
    .bind(userId, 100, 0)
    .run();

  return successResponse({ message: "注册成功" }, 201);
}