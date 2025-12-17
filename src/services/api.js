// CometAPI 服务层

// CometAPI 基础URL
const COMET_API_BASE_URL = 'https://api.cometapi.com/v1';

// 默认API密钥（实际使用时应从环境变量获取）
const DEFAULT_API_KEY = 'your-cometapi-key';

/**
 * 获取API密钥（从localStorage或使用默认密钥）
 */
const getApiKey = () => {
  return localStorage.getItem('cometapi_key') || DEFAULT_API_KEY;
};

/**
 * 设置API密钥到localStorage
 */
const setApiKey = (key) => {
  localStorage.setItem('cometapi_key', key);
};

/**
 * 图像生成API
 * @param {Object} params - 生成参数
 * @returns {Promise<Object>} 生成结果
 */
export const generateImage = async (params) => {
  const apiKey = getApiKey();
  
  try {
    const response = await fetch(`${COMET_API_BASE_URL}/images/generate`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: params.model || 'nano-banana-pro',
        prompt: params.prompt,
        negative_prompt: params.negativePrompt,
        width: params.width || 1024,
        height: params.height || 768,
        steps: params.steps || 50,
        cfg_scale: params.cfgScale || 7,
        seed: params.seed,
        sampler: params.sampler || 'euler_a',
        batch_size: params.batchSize || 1
      })
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || '图像生成失败');
    }
    
    return await response.json();
  } catch (error) {
    console.error('CometAPI图像生成错误:', error);
    throw error;
  }
};

/**
 * 视频生成API
 * @param {Object} params - 生成参数
 * @returns {Promise<Object>} 生成结果
 */
export const generateVideo = async (params) => {
  const apiKey = getApiKey();
  
  try {
    const response = await fetch(`${COMET_API_BASE_URL}/videos/generate`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: params.model || 'sora-2',
        prompt: params.prompt,
        negative_prompt: params.negativePrompt,
        width: params.width || 1024,
        height: params.height || 768,
        duration: params.duration || 10,
        steps: params.steps || 50,
        cfg_scale: params.cfgScale || 7,
        seed: params.seed
      })
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || '视频生成失败');
    }
    
    return await response.json();
  } catch (error) {
    console.error('CometAPI视频生成错误:', error);
    throw error;
  }
};

/**
 * 文本生成API（LLM）
 * @param {Object} params - 生成参数
 * @returns {Promise<Object>} 生成结果
 */
export const generateText = async (params) => {
  const apiKey = getApiKey();
  
  try {
    const response = await fetch(`${COMET_API_BASE_URL}/chat/completions`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: params.model || 'gpt-4o',
        messages: params.messages || [],
        temperature: params.temperature || 0.7,
        max_tokens: params.maxTokens || 1000
      })
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || '文本生成失败');
    }
    
    return await response.json();
  } catch (error) {
    console.error('CometAPI文本生成错误:', error);
    throw error;
  }
};

/**
 * 检查生成任务状态
 * @param {string} taskId - 任务ID
 * @returns {Promise<Object>} 任务状态
 */
export const checkTaskStatus = async (taskId) => {
  const apiKey = getApiKey();
  
  try {
    const response = await fetch(`${COMET_API_BASE_URL}/tasks/${taskId}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      }
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || '任务状态检查失败');
    }
    
    return await response.json();
  } catch (error) {
    console.error('CometAPI任务状态检查错误:', error);
    throw error;
  }
};

/**
 * 获取模型列表
 * @returns {Promise<Array>} 模型列表
 */
export const getModels = async () => {
  const apiKey = getApiKey();
  
  try {
    const response = await fetch(`${COMET_API_BASE_URL}/models`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      }
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || '获取模型列表失败');
    }
    
    const data = await response.json();
    return data.models || [];
  } catch (error) {
    console.error('CometAPI获取模型列表错误:', error);
    throw error;
  }
};

// 导出API密钥管理函数
export { getApiKey, setApiKey };