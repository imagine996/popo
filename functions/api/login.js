import { hashPassword, generateJWT } from '../utils/auth.js';
import { successResponse, errorResponse } from '../utils/response.js';

export async function onRequestPost(context) {
  const { request, env } = context;
  const { username, password } = await request.json();

  // 1. 密码哈希处理
  const hashedPassword = await hashPassword(password);

  // 2. 查询用户
  const user = await env.DB.prepare("SELECT * FROM users WHERE username = ? AND password = ?")
    .bind(username, hashedPassword)
    .first();

  if (!user) {
    return errorResponse("用户名或密码错误", 401);
  }

  // 3. 生成JWT
  const token = await generateJWT(user.id, user.username, env.JWT_SECRET);

  return successResponse({ message: "登录成功", token });
}