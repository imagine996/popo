import { successResponse, errorResponse } from '../utils/response.js';

export async function onRequestGet(context) {
  const { env, data } = context;
  const userId = data.user.sub;
  const url = new URL(context.request.url);
  const taskId = url.searchParams.get('taskId');
  
  if (!taskId) {
    return errorResponse("缺少任务ID", 400);
  }
  
  // 查询任务状态
  const task = await env.DB.prepare(
    "SELECT id, task_type, status, prompt, result, created_at, completed_at FROM ai_tasks WHERE id = ? AND user_id = ?"
  ).bind(taskId, userId).first();
  
  if (!task) {
    return errorResponse("任务不存在或无权限访问", 404);
  }
  
  return successResponse({ task });
}