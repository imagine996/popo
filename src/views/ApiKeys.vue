<script setup>
import { ref } from 'vue';

// API密钥列表
const apiKeys = ref([
  {
    id: 1,
    name: '主密钥',
    key: 'sk-1234567890abcdef1234567890abcdef',
    created: '2023-01-15',
    lastUsed: '2023-01-20',
    status: 'active'
  },
  {
    id: 2,
    name: '开发密钥',
    key: 'sk-abcdef1234567890abcdef1234567890',
    created: '2023-01-18',
    lastUsed: '2023-01-19',
    status: 'active'
  }
]);

// 显示密钥创建表单
const showCreateForm = ref(false);

// 新密钥表单数据
const newKeyForm = ref({
  name: ''
});

// 消息提示
const message = ref('');
const messageType = ref('');

// 显示消息
const showMessage = (text, type) => {
  message.value = text;
  messageType.value = type;
  setTimeout(() => {
    message.value = '';
    messageType.value = '';
  }, 3000);
};

// 生成随机API密钥
const generateApiKey = () => {
  const chars = 'abcdef0123456789';
  let result = 'sk-';
  for (let i = 0; i < 32; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
};

// 创建新API密钥
const createApiKey = () => {
  if (!newKeyForm.value.name.trim()) {
    showMessage('密钥名称不能为空', 'error');
    return;
  }
  
  const newKey = {
    id: Date.now(),
    name: newKeyForm.value.name,
    key: generateApiKey(),
    created: new Date().toISOString().split('T')[0],
    lastUsed: '-',
    status: 'active'
  };
  
  apiKeys.value.unshift(newKey);
  newKeyForm.value.name = '';
  showCreateForm.value = false;
  showMessage('API密钥创建成功', 'success');
};

// 删除API密钥
const deleteApiKey = (id) => {
  if (confirm('确定要删除这个API密钥吗？')) {
    apiKeys.value = apiKeys.value.filter(key => key.id !== id);
    showMessage('API密钥删除成功', 'success');
  }
};

// 复制API密钥到剪贴板
const copyToClipboard = (key) => {
  navigator.clipboard.writeText(key)
    .then(() => {
      showMessage('API密钥已复制到剪贴板', 'success');
    })
    .catch(() => {
      showMessage('复制失败，请手动复制', 'error');
    });
};

// 切换密钥状态
const toggleKeyStatus = (id) => {
  const key = apiKeys.value.find(key => key.id === id);
  if (key) {
    key.status = key.status === 'active' ? 'inactive' : 'active';
    showMessage(`API密钥已${key.status === 'active' ? '激活' : '停用'}`, 'success');
  }
};
</script>

<template>
  <div class="app-container">
    <!-- 顶部导航栏 -->
    <header class="app-header">
      <div class="header-content">
        <div class="logo">
          <a href="#/">AI Assistant</a>
        </div>
        <nav class="main-nav">
          <a href="#/app" class="nav-link">AI 应用</a>
          <a href="#/profile" class="nav-link">个人中心</a>
          <a href="#/api-keys" class="nav-link active">API 密钥</a>
        </nav>
        <div class="user-actions">
          <button class="logout-btn">退出登录</button>
        </div>
      </div>
    </header>
    
    <!-- 主要内容区域 -->
    <main class="apikeys-main">
      <div class="apikeys-container">
        <!-- 页面标题和操作按钮 -->
        <div class="apikeys-header">
          <div>
            <h1 class="page-title">API 密钥管理</h1>
            <p class="page-description">创建和管理您的API密钥，用于访问AI服务API</p>
          </div>
          <button 
            class="create-btn" 
            @click="showCreateForm = !showCreateForm"
          >
            {{ showCreateForm ? '取消' : '创建新密钥' }}
          </button>
        </div>
        
        <!-- 消息提示 -->
        <div 
          v-if="message" 
          class="message" 
          :class="messageType"
        >
          {{ message }}
        </div>
        
        <!-- 创建密钥表单 -->
        <div 
          v-if="showCreateForm" 
          class="create-form-section"
        >
          <div class="form-card">
            <h2 class="form-title">创建新API密钥</h2>
            <form @submit.prevent="createApiKey" class="create-form">
              <div class="form-group">
                <label class="form-label">密钥名称</label>
                <input 
                  type="text" 
                  class="form-input" 
                  v-model="newKeyForm.name"
                  placeholder="请输入密钥名称（如：主密钥、开发密钥）"
                  required
                >
                <p class="form-hint">为您的密钥添加一个描述性名称，方便后续管理</p>
              </div>
              <div class="form-actions">
                <button type="submit" class="primary-btn">创建密钥</button>
              </div>
            </form>
          </div>
        </div>
        
        <!-- API密钥列表 -->
        <div class="api-keys-section">
          <div class="keys-table-container">
            <table class="keys-table">
              <thead>
                <tr>
                  <th>名称</th>
                  <th>API 密钥</th>
                  <th>创建时间</th>
                  <th>最后使用</th>
                  <th>状态</th>
                  <th>操作</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="key in apiKeys" :key="key.id">
                  <td class="key-name">{{ key.name }}</td>
                  <td class="key-value">
                    <div class="key-display">
                      <span>{{ key.key }}</span>
                      <button 
                        class="copy-btn" 
                        @click="copyToClipboard(key.key)"
                        title="复制密钥"
                      >
                        📋
                      </button>
                    </div>
                  </td>
                  <td class="key-created">{{ key.created }}</td>
                  <td class="key-last-used">{{ key.lastUsed }}</td>
                  <td class="key-status">
                    <span 
                      class="status-badge" 
                      :class="key.status"
                      @click="toggleKeyStatus(key.id)"
                    >
                      {{ key.status === 'active' ? '活跃' : '停用' }}
                    </span>
                  </td>
                  <td class="key-actions">
                    <button 
                      class="delete-btn" 
                      @click="deleteApiKey(key.id)"
                      title="删除密钥"
                    >
                      🗑️
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
            
            <!-- 空状态 -->
            <div v-if="apiKeys.length === 0" class="empty-state">
              <div class="empty-icon">🔑</div>
              <h3>暂无API密钥</h3>
              <p>点击"创建新密钥"按钮开始创建您的第一个API密钥</p>
            </div>
          </div>
        </div>
        
        <!-- 安全提示 -->
        <div class="security-tips">
          <h3>安全提示</h3>
          <ul>
            <li>请妥善保管您的API密钥，不要分享给他人</li>
            <li>定期轮换您的API密钥以提高安全性</li>
            <li>如果怀疑密钥泄露，请立即删除并创建新密钥</li>
            <li>每个密钥都有独立的使用统计和权限控制</li>
          </ul>
        </div>
      </div>
    </main>
  </div>
</template>

<style scoped>
/* API密钥管理页面样式 */
.app-container {
  width: 100%;
  min-height: 100vh;
  background-color: var(--bg-color);
  display: flex;
  flex-direction: column;
}

/* 主要内容区域 */
.apikeys-main {
  max-width: 1400px;
  margin: 0 auto;
  padding: 2rem;
  flex: 1;
}

.apikeys-container {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

/* 页面标题和操作按钮 */
.apikeys-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 1rem;
}

.page-title {
  font-size: 2em;
  font-weight: 700;
  color: var(--text-color);
  margin: 0 0 0.5rem;
}

.page-description {
  color: #666;
  margin: 0;
}

.create-btn {
  background-color: var(--tiffany-blue);
  color: white;
  border: none;
  padding: 0.6em 1.5em;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.create-btn:hover {
  background-color: var(--tiffany-blue-dark);
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(0, 180, 216, 0.3);
}

/* 创建密钥表单 */
.create-form-section {
  animation: slideDown 0.3s ease-out;
}

@keyframes slideDown {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.form-card {
  background-color: var(--card-bg);
  border-radius: 16px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  padding: 2rem;
}

.form-title {
  font-size: 1.3em;
  font-weight: 700;
  color: var(--text-color);
  margin-bottom: 2rem;
}

.create-form {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  max-width: 600px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.form-label {
  font-weight: 600;
  color: var(--text-color);
  font-size: 0.9em;
}

.form-input {
  width: 100%;
}

.form-hint {
  font-size: 0.8em;
  color: #666;
  margin: 0;
  padding: 0;
}

.form-actions {
  display: flex;
  gap: 1rem;
  margin-top: 1rem;
}

.primary-btn {
  background-color: var(--tiffany-blue);
  color: white;
  border: none;
  padding: 0.6em 1.5em;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.primary-btn:hover {
  background-color: var(--tiffany-blue-dark);
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(0, 180, 216, 0.3);
}

/* API密钥列表 */
.api-keys-section {
  background-color: var(--card-bg);
  border-radius: 16px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  padding: 2rem;
  overflow: hidden;
}

.keys-table-container {
  overflow-x: auto;
}

.keys-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 0.95em;
}

.keys-table th,
.keys-table td {
  padding: 1rem;
  text-align: left;
  border-bottom: 1px solid var(--border-color);
}

.keys-table th {
  font-weight: 600;
  color: var(--text-color);
  background-color: #f0f8ff;
  position: sticky;
  top: 0;
}

.keys-table tr:last-child td {
  border-bottom: none;
}

/* 密钥名称 */
.key-name {
  font-weight: 600;
  color: var(--text-color);
}

/* 密钥值显示 */
.key-value {
  max-width: 300px;
}

.key-display {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background-color: #f5f5f5;
  padding: 0.5rem 1rem;
  border-radius: 8px;
  font-family: 'Courier New', Courier, monospace;
  font-size: 0.9em;
  word-break: break-all;
}

.copy-btn {
  background: none;
  border: none;
  cursor: pointer;
  padding: 0.3rem;
  border-radius: 4px;
  transition: all 0.3s ease;
  font-size: 1.1em;
}

.copy-btn:hover {
  background-color: rgba(0, 180, 216, 0.1);
}

/* 状态标签 */
.status-badge {
  display: inline-block;
  padding: 0.3rem 0.8rem;
  border-radius: 20px;
  font-size: 0.8em;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.status-badge.active {
  background-color: rgba(0, 180, 216, 0.1);
  color: var(--tiffany-blue);
}

.status-badge.inactive {
  background-color: rgba(100, 116, 139, 0.1);
  color: #64748b;
}

.status-badge:hover {
  opacity: 0.8;
  transform: scale(1.05);
}

/* 操作按钮 */
.key-actions {
  display: flex;
  gap: 0.5rem;
}

.delete-btn {
  background: none;
  border: none;
  cursor: pointer;
  padding: 0.3rem;
  border-radius: 4px;
  transition: all 0.3s ease;
  font-size: 1.1em;
}

.delete-btn:hover {
  background-color: rgba(239, 68, 68, 0.1);
  color: var(--error-color);
}

/* 空状态 */
.empty-state {
  text-align: center;
  padding: 4rem 2rem;
  color: #666;
}

.empty-icon {
  font-size: 4em;
  margin-bottom: 1rem;
}

.empty-state h3 {
  font-size: 1.2em;
  font-weight: 600;
  color: var(--text-color);
  margin-bottom: 0.5rem;
}

/* 安全提示 */
.security-tips {
  background-color: rgba(0, 180, 216, 0.05);
  border: 1px solid var(--border-color);
  border-radius: 16px;
  padding: 2rem;
}

.security-tips h3 {
  font-size: 1.1em;
  font-weight: 700;
  color: var(--text-color);
  margin-bottom: 1rem;
}

.security-tips ul {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.security-tips li {
  display: flex;
  align-items: flex-start;
  gap: 0.8rem;
  color: #666;
}

.security-tips li::before {
  content: "⚠️";
  font-size: 1.2em;
  flex-shrink: 0;
  margin-top: 0.1rem;
}

/* 响应式设计 */
@media (max-width: 1024px) {
  .apikeys-main {
    padding: 1rem;
  }
  
  .api-keys-section {
    padding: 1.5rem;
  }
  
  .keys-table th,
  .keys-table td {
    padding: 0.8rem;
    font-size: 0.9em;
  }
}

@media (max-width: 768px) {
  .apikeys-header {
    flex-direction: column;
    align-items: flex-start;
  }
  
  .create-form {
    max-width: 100%;
  }
  
  .keys-table {
    font-size: 0.85em;
  }
  
  .keys-table th,
  .keys-table td {
    padding: 0.6rem;
  }
  
  .key-display {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.5rem;
  }
  
  .copy-btn {
    align-self: flex-end;
  }
  
  .security-tips ul {
    gap: 1.5rem;
  }
}
</style>