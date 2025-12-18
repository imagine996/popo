import { successResponse, errorResponse } from '../utils/response.js';

export async function onRequestGet(context) {
  const { env, data } = context;
  const userId = data.user.sub;
  
  // 查询用户的任务历史
  const tasks = await env.DB.prepare(
    "SELECT id, task_type, status, prompt, result_url, created_at FROM ai_tasks WHERE user_id = ? ORDER BY created_at DESC"
  ).bind(userId).all();
  
  return successResponse({ tasks: tasks.results });
}

export async function onRequestPost(context) {
  const { request, env, data } = context;
  const userId = data.user.sub;
  const { task_type, prompt } = await request.json();
  
  if (!task_type || !prompt) {
    return errorResponse("缺少必要参数", 400);
  }
  
  // 创建新的AI任务
  const result = await env.DB.prepare(
    "INSERT INTO ai_tasks (user_id, task_type, status, prompt) VALUES (?, ?, ?, ?)"
  ).bind(userId, task_type, 'pending', prompt).run();
  
  const taskId = result.meta.last_row_id;
  
  return successResponse({ message: "任务创建成功", taskId }, 201);
}