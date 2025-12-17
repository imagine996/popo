<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { generateImage as cometGenerateImage } from '../services/api';

const router = useRouter();

// 模型选择
const models = ref([
  { id: 'nano-banana-pro', name: 'Nano Banana Pro' },
  { id: 'gpt-4o-image', name: 'GPT-4O Image' },
  { id: 'flux-2', name: 'Flux 2' },
  { id: 'sora-2', name: 'Sora 2' },
  { id: 'veo-3.1', name: 'Veo 3.1' },
  { id: 'kling-2.5', name: 'Kling 2.5' }
]);

const selectedModel = ref('nano-banana-pro');

// 生成参数
const parameters = ref({
  prompt: '',
  negativePrompt: '',
  width: 1024,
  height: 768,
  steps: 50,
  cfgScale: 7,
  seed: Math.floor(Math.random() * 1000000),
  sampler: 'euler_a',
  batchSize: 1
});

// 生成历史
const history = ref([
  {
    id: 1,
    prompt: '一只可爱的小猫在阳光下睡觉',
    model: 'nano-banana-pro',
    imageUrl: 'https://picsum.photos/id/237/800/600',
    timestamp: '2025-12-18 10:30',
    status: 'completed'
  },
  {
    id: 2,
    prompt: '一个现代化的城市夜景',
    model: 'gpt-4o-image',
    imageUrl: 'https://picsum.photos/id/1036/800/600',
    timestamp: '2025-12-18 10:25',
    status: 'completed'
  }
]);

// 生成结果
const generatedResults = ref([]);

// 加载状态
const isGenerating = ref(false);
const generationProgress = ref(0);

// 侧边栏状态
const isParametersOpen = ref(true);
const isHistoryOpen = ref(true);

// 生成图像
const generateImage = async () => {
  if (!parameters.value.prompt.trim() || isGenerating.value) return;
  
  isGenerating.value = true;
  generationProgress.value = 0;
  
  try {
    // 显示进度
    const progressInterval = setInterval(() => {
      if (generationProgress.value < 90) {
        generationProgress.value += Math.random() * 5;
      }
    }, 300);
    
    // 调用CometAPI生成图像
    const result = await cometGenerateImage({
      model: selectedModel.value,
      prompt: parameters.value.prompt,
      negativePrompt: parameters.value.negativePrompt,
      width: parameters.value.width,
      height: parameters.value.height,
      steps: parameters.value.steps,
      cfgScale: parameters.value.cfgScale,
      seed: parameters.value.seed,
      sampler: parameters.value.sampler,
      batchSize: parameters.value.batchSize
    });
    
    // 清除进度更新
    clearInterval(progressInterval);
    generationProgress.value = 100;
    
    // 处理生成结果
    const newResult = {
      id: Date.now(),
      prompt: parameters.value.prompt,
      model: selectedModel.value,
      imageUrl: result.image_url || result.images?.[0]?.url || '',
      timestamp: new Date().toLocaleString(),
      status: 'completed',
      parameters: { ...parameters.value },
      cometResult: result
    };
    
    generatedResults.value.unshift(newResult);
    history.value.unshift(newResult);
  } catch (error) {
    console.error('图像生成失败:', error);
    alert('图像生成失败: ' + error.message);
  } finally {
    isGenerating.value = false;
    generationProgress.value = 0;
  }
};

// 复制到提示词
const copyToPrompt = (item) => {
  parameters.value.prompt = item.prompt;
  selectedModel.value = item.model;
};

// 清空所有结果
const clearAllResults = () => {
  generatedResults.value = [];
};

// 切换侧边栏
const toggleSidebar = (sidebar) => {
  if (sidebar === 'parameters') {
    isParametersOpen.value = !isParametersOpen.value;
  } else if (sidebar === 'history') {
    isHistoryOpen.value = !isHistoryOpen.value;
  }
};

// 随机种子
const randomSeed = () => {
  parameters.value.seed = Math.floor(Math.random() * 1000000);
};

// 处理登出
const handleLogout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  router.push('/login');
};
</script>

<template>
  <div class="ai-app-container">
    <!-- 顶部导航栏 -->
    <header class="app-header">
      <div class="header-content">
        <div class="logo">
          <router-link to="/" class="brand-link">OiiOii AI</router-link>
        </div>
        
        <nav class="main-nav">
          <router-link to="/app" class="nav-link active">AI 生成</router-link>
          <router-link to="/profile" class="nav-link">个人中心</router-link>
          <router-link to="/api-keys" class="nav-link">API 密钥</router-link>
        </nav>
        
        <div class="user-actions">
          <button class="logout-btn" @click="handleLogout">退出登录</button>
        </div>
      </div>
    </header>
    
    <!-- 主要内容区域 -->
    <main class="app-main">
      <!-- 左侧控制面板 -->
      <aside class="control-panel">
        <!-- 模型选择 -->
        <div class="panel-section">
          <div class="section-header">
            <h3>模型选择</h3>
          </div>
          <div class="model-selector">
            <select v-model="selectedModel" class="model-dropdown">
              <option v-for="model in models" :key="model.id" :value="model.id">
                {{ model.name }}
              </option>
            </select>
          </div>
        </div>
        
        <!-- 生成参数 -->
        <div class="panel-section">
          <div class="section-header" @click="toggleSidebar('parameters')">
            <h3>生成参数</h3>
            <span class="toggle-icon">{{ isParametersOpen ? '▼' : '▶' }}</span>
          </div>
          
          <div v-if="isParametersOpen" class="parameters-grid">
            <!-- 提示词输入 -->
            <div class="parameter-group full-width">
              <label class="parameter-label">提示词</label>
              <textarea 
                v-model="parameters.prompt" 
                class="parameter-input prompt-input"
                placeholder="请输入您的提示词..."
                rows="3"
              ></textarea>
            </div>
            
            <!-- 反向提示词 -->
            <div class="parameter-group full-width">
              <label class="parameter-label">反向提示词</label>
              <textarea 
                v-model="parameters.negativePrompt" 
                class="parameter-input prompt-input"
                placeholder="请输入您的反向提示词..."
                rows="2"
              ></textarea>
            </div>
            
            <!-- 分辨率 -->
            <div class="parameter-group">
              <label class="parameter-label">宽度</label>
              <input 
                type="number" 
                v-model="parameters.width" 
                class="parameter-input"
                min="256"
                max="4096"
              >
            </div>
            
            <div class="parameter-group">
              <label class="parameter-label">高度</label>
              <input 
                type="number" 
                v-model="parameters.height" 
                class="parameter-input"
                min="256"
                max="4096"
              >
            </div>
            
            <!-- 采样步数 -->
            <div class="parameter-group">
              <label class="parameter-label">采样步数</label>
              <input 
                type="number" 
                v-model="parameters.steps" 
                class="parameter-input"
                min="1"
                max="100"
              >
            </div>
            
            <!-- CFG Scale -->
            <div class="parameter-group">
              <label class="parameter-label">CFG Scale</label>
              <input 
                type="number" 
                v-model="parameters.cfgScale" 
                class="parameter-input"
                min="1"
                max="30"
                step="0.5"
              >
            </div>
            
            <!-- 采样器 -->
            <div class="parameter-group">
              <label class="parameter-label">采样器</label>
              <select v-model="parameters.sampler" class="parameter-input">
                <option value="euler_a">Euler a</option>
                <option value="euler">Euler</option>
                <option value="lms">LMS</option>
                <option value="heun">Heun</option>
                <option value="dpm_2">DPM2</option>
                <option value="dpm_2_a">DPM2 a</option>
              </select>
            </div>
            
            <!-- 批次大小 -->
            <div class="parameter-group">
              <label class="parameter-label">批次大小</label>
              <input 
                type="number" 
                v-model="parameters.batchSize" 
                class="parameter-input"
                min="1"
                max="10"
              >
            </div>
            
            <!-- 随机种子 -->
            <div class="parameter-group seed-group">
              <label class="parameter-label">随机种子</label>
              <div class="seed-input-wrapper">
                <input 
                  type="number" 
                  v-model="parameters.seed" 
                  class="parameter-input seed-input"
                >
                <button @click="randomSeed" class="random-seed-btn">🎲</button>
              </div>
            </div>
          </div>
        </div>
        
        <!-- 生成按钮 -->
        <div class="panel-section">
          <button 
            @click="generateImage" 
            class="generate-btn"
            :disabled="isGenerating || !parameters.prompt.trim()"
          >
            <span v-if="isGenerating">生成中...</span>
            <span v-else>生成图像</span>
          </button>
          
          <!-- 进度条 -->
          <div v-if="isGenerating" class="progress-container">
            <div class="progress-bar">
              <div 
                class="progress-fill" 
                :style="{ width: `${generationProgress}%` }"
              ></div>
            </div>
            <span class="progress-text">{{ Math.round(generationProgress) }}%</span>
          </div>
        </div>
      </aside>
      
      <!-- 右侧生成结果区域 -->
      <section class="results-section">
        <!-- 结果控制栏 -->
        <div class="results-header">
          <h2>生成结果</h2>
          <div class="results-actions">
            <button @click="clearAllResults" class="action-btn clear-btn">
              清空所有
            </button>
          </div>
        </div>
        
        <!-- 生成结果网格 -->
        <div v-if="generatedResults.length > 0" class="results-grid">
          <div 
            v-for="result in generatedResults" 
            :key="result.id" 
            class="result-card"
          >
            <div class="result-image-container">
              <img :src="result.imageUrl" :alt="result.prompt" class="result-image">
            </div>
            <div class="result-info">
              <div class="result-prompt">{{ result.prompt }}</div>
              <div class="result-meta">
                <span class="meta-item">
                  <strong>模型:</strong> {{ models.find(m => m.id === result.model)?.name }}
                </span>
                <span class="meta-item">
                  <strong>分辨率:</strong> {{ result.parameters.width }}x{{ result.parameters.height }}
                </span>
                <span class="meta-item">
                  <strong>步数:</strong> {{ result.parameters.steps }}
                </span>
                <span class="meta-item">
                  <strong>时间:</strong> {{ result.timestamp }}
                </span>
              </div>
              <div class="result-actions">
                <button @click="copyToPrompt(result)" class="action-btn small-btn">
                  复制到提示词
                </button>
              </div>
            </div>
          </div>
        </div>
        
        <!-- 空状态 -->
        <div v-else class="empty-state">
          <div class="empty-icon">🎨</div>
          <h3>还没有生成结果</h3>
          <p>输入提示词，选择模型和参数，点击生成按钮开始创作吧！</p>
        </div>
      </section>
      
      <!-- 底部历史记录 -->
      <aside class="history-panel">
        <div class="section-header" @click="toggleSidebar('history')">
          <h3>历史记录</h3>
          <span class="toggle-icon">{{ isHistoryOpen ? '▼' : '▶' }}</span>
        </div>
        
        <div v-if="isHistoryOpen" class="history-list">
          <div 
            v-for="item in history" 
            :key="item.id" 
            class="history-item"
            @click="copyToPrompt(item)"
          >
            <div class="history-image">
              <img :src="item.imageUrl" :alt="item.prompt">
            </div>
            <div class="history-content">
              <div class="history-prompt">{{ item.prompt }}</div>
              <div class="history-time">{{ item.timestamp }}</div>
            </div>
          </div>
        </div>
      </aside>
    </main>
  </div>
</template>

<style scoped>
/* AI应用容器 */
.ai-app-container {
  width: 100%;
  min-height: 100vh;
  background-color: var(--bg-color);
  display: flex;
  flex-direction: column;
  color: var(--text-primary);
}

/* 应用头部 */
.app-header {
  background-color: var(--card-bg);
  box-shadow: var(--shadow-md);
  padding: 1rem 0;
  position: sticky;
  top: 0;
  z-index: 100;
}

.header-content {
  max-width: 1600px;
  margin: 0 auto;
  padding: 0 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.logo a {
  font-size: 1.5em;
  font-weight: 700;
  color: var(--tiffany-blue);
  text-decoration: none;
}

.main-nav {
  display: flex;
  gap: 2rem;
}

.main-nav .nav-link {
  font-weight: 600;
  color: var(--text-secondary);
  padding: 0.5rem 1rem;
  border-radius: 8px;
  text-decoration: none;
  transition: all 0.3s ease;
}

.main-nav .nav-link:hover, .main-nav .nav-link.active {
  background-color: var(--tiffany-blue-pale);
  color: var(--tiffany-blue);
}

.user-actions {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.logout-btn {
  padding: 0.5rem 1rem;
  background-color: transparent;
  color: var(--error-color);
  border: 1px solid var(--error-color);
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.logout-btn:hover {
  background-color: var(--error-color);
  color: white;
}

/* 主要内容区域 */
.app-main {
  max-width: 1600px;
  margin: 0 auto;
  padding: 2rem;
  flex: 1;
  display: grid;
  grid-template-columns: 350px 1fr 250px;
  gap: 2rem;
  align-items: start;
}

/* 控制面板 */
.control-panel {
  background-color: var(--card-bg);
  border-radius: 16px;
  box-shadow: var(--shadow-md);
  padding: 1.5rem;
  height: fit-content;
  position: sticky;
  top: 100px;
}

/* 面板部分 */
.panel-section {
  margin-bottom: 2rem;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
  cursor: pointer;
  user-select: none;
}

.section-header h3 {
  font-size: 1.1em;
  font-weight: 700;
  color: var(--text-primary);
  margin: 0;
}

.toggle-icon {
  font-size: 0.8em;
  color: var(--text-muted);
  transition: transform 0.3s ease;
}

/* 模型选择器 */
.model-selector {
  margin-bottom: 1.5rem;
}

.model-dropdown {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid var(--border-color);
  border-radius: 12px;
  background-color: var(--bg-color);
  color: var(--text-primary);
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.3s ease;
}

.model-dropdown:focus {
  outline: none;
  border-color: var(--tiffany-blue);
  box-shadow: 0 0 0 3px var(--tiffany-blue-pale);
}

/* 参数网格 */
.parameters-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
}

.full-width {
  grid-column: 1 / -1;
}

.parameter-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.parameter-label {
  font-size: 0.85em;
  font-weight: 600;
  color: var(--text-secondary);
}

.parameter-input {
  padding: 0.75rem;
  border: 1px solid var(--border-color);
  border-radius: 12px;
  background-color: var(--bg-color);
  color: var(--text-primary);
  font-size: 1rem;
  transition: all 0.3s ease;
}

.parameter-input:focus {
  outline: none;
  border-color: var(--tiffany-blue);
  box-shadow: 0 0 0 3px var(--tiffany-blue-pale);
}

/* 特殊参数样式 */
.prompt-input {
  resize: vertical;
  min-height: 80px;
  font-family: inherit;
  line-height: 1.5;
}

.seed-group {
  grid-column: 1 / -1;
}

.seed-input-wrapper {
  display: flex;
  gap: 0.5rem;
}

.seed-input {
  flex: 1;
}

.random-seed-btn {
  padding: 0.75rem;
  border: 1px solid var(--border-color);
  border-radius: 12px;
  background-color: var(--bg-color);
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 1rem;
}

.random-seed-btn:hover {
  background-color: var(--tiffany-blue-pale);
  border-color: var(--tiffany-blue);
}

/* 生成按钮 */
.generate-btn {
  width: 100%;
  padding: 1rem;
  background-color: var(--tiffany-blue);
  color: white;
  border: none;
  border-radius: 12px;
  font-size: 1.1rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.3s ease;
}

.generate-btn:hover:not(:disabled) {
  background-color: var(--tiffany-blue-dark);
  transform: translateY(-2px);
  box-shadow: var(--shadow-lg);
}

.generate-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* 进度条 */
.progress-container {
  margin-top: 1rem;
  display: flex;
  align-items: center;
  gap: 1rem;
}

.progress-bar {
  flex: 1;
  height: 8px;
  background-color: var(--border-color);
  border-radius: 4px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background-color: var(--tiffany-blue);
  transition: width 0.3s ease;
}

.progress-text {
  font-size: 0.85em;
  color: var(--text-muted);
  min-width: 40px;
  text-align: right;
}

/* 结果区域 */
.results-section {
  background-color: var(--card-bg);
  border-radius: 16px;
  box-shadow: var(--shadow-md);
  padding: 2rem;
  overflow: hidden;
}

.results-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}

.results-header h2 {
  font-size: 1.5em;
  font-weight: 700;
  color: var(--text-primary);
  margin: 0;
}

.results-actions {
  display: flex;
  gap: 1rem;
}

.action-btn {
  padding: 0.75rem 1.5rem;
  border: 1px solid var(--border-color);
  border-radius: 12px;
  background-color: var(--bg-color);
  color: var(--text-primary);
  cursor: pointer;
  transition: all 0.3s ease;
  font-weight: 600;
}

.action-btn:hover {
  background-color: var(--tiffany-blue-pale);
  border-color: var(--tiffany-blue);
  color: var(--tiffany-blue);
}

.small-btn {
  padding: 0.5rem 1rem;
  font-size: 0.85em;
}

.clear-btn {
  color: var(--error-color);
  border-color: var(--error-color);
}

.clear-btn:hover {
  background-color: var(--error-color);
  color: white;
}

/* 结果网格 */
.results-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1.5rem;
}

/* 结果卡片 */
.result-card {
  background-color: var(--bg-color);
  border-radius: 12px;
  overflow: hidden;
  box-shadow: var(--shadow-sm);
  transition: all 0.3s ease;
}

.result-card:hover {
  transform: translateY(-4px);
  box-shadow: var(--shadow-lg);
}

.result-image-container {
  width: 100%;
  aspect-ratio: 16/9;
  overflow: hidden;
  background-color: #f0f0f0;
}

.result-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.result-card:hover .result-image {
  transform: scale(1.05);
}

.result-info {
  padding: 1rem;
}

.result-prompt {
  font-size: 0.9rem;
  line-height: 1.5;
  margin-bottom: 0.75rem;
  color: var(--text-primary);
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
}

.result-meta {
  font-size: 0.8em;
  color: var(--text-muted);
  margin-bottom: 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.meta-item strong {
  color: var(--text-secondary);
}

.result-actions {
  display: flex;
  gap: 0.5rem;
}

/* 空状态 */
.empty-state {
  text-align: center;
  padding: 4rem 2rem;
  color: var(--text-muted);
}

.empty-icon {
  font-size: 4rem;
  margin-bottom: 1rem;
}

.empty-state h3 {
  font-size: 1.2em;
  font-weight: 700;
  color: var(--text-secondary);
  margin-bottom: 0.5rem;
}

/* 历史记录面板 */
.history-panel {
  background-color: var(--card-bg);
  border-radius: 16px;
  box-shadow: var(--shadow-md);
  padding: 1.5rem;
  height: fit-content;
  position: sticky;
  top: 100px;
}

/* 历史记录列表 */
.history-list {
  max-height: 600px;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

/* 历史记录项 */
.history-item {
  display: flex;
  gap: 1rem;
  padding: 0.75rem;
  background-color: var(--bg-color);
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s ease;
  border: 1px solid transparent;
}

.history-item:hover {
  border-color: var(--tiffany-blue);
  box-shadow: var(--shadow-sm);
}

.history-image {
  width: 60px;
  height: 60px;
  border-radius: 8px;
  overflow: hidden;
  flex-shrink: 0;
}

.history-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.history-content {
  flex: 1;
  min-width: 0;
}

.history-prompt {
  font-size: 0.85rem;
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: 0.25rem;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
}

.history-time {
  font-size: 0.75rem;
  color: var(--text-muted);
}

/* 响应式设计 */
@media (max-width: 1400px) {
  .app-main {
    grid-template-columns: 300px 1fr 200px;
    gap: 1.5rem;
  }
}

@media (max-width: 1200px) {
  .app-main {
    grid-template-columns: 1fr;
  }
  
  .control-panel,
  .history-panel {
    position: static;
    width: 100%;
  }
  
  .history-panel {
    order: -1;
  }
}

@media (max-width: 768px) {
  .app-main {
    padding: 1rem;
    gap: 1rem;
  }
  
  .control-panel,
  .results-section,
  .history-panel {
    padding: 1rem;
  }
  
  .results-grid {
    grid-template-columns: 1fr;
  }
  
  .header-content {
    padding: 0 1rem;
  }
  
  .main-nav {
    gap: 1rem;
  }
}
</style>