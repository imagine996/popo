<script setup>
import { ref } from 'vue';

// 用户信息
const user = ref({
  name: '张三',
  email: 'zhangsan@example.com',
  avatar: '👤',
  memberSince: '2023-01-15',
  usage: {
    apiCalls: 1250,
    storageUsed: '2.5 GB',
    remainingCalls: 8750
  }
});

// 表单数据
const formData = ref({
  name: user.value.name,
  email: user.value.email,
  password: '',
  confirmPassword: ''
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

// 保存个人信息
const saveProfile = () => {
  if (!formData.value.name.trim()) {
    showMessage('姓名不能为空', 'error');
    return;
  }
  
  user.value.name = formData.value.name;
  showMessage('个人信息更新成功', 'success');
};

// 更改密码
const changePassword = () => {
  if (!formData.value.password || !formData.value.confirmPassword) {
    showMessage('密码不能为空', 'error');
    return;
  }
  
  if (formData.value.password !== formData.value.confirmPassword) {
    showMessage('两次输入的密码不一致', 'error');
    return;
  }
  
  // 清空密码字段
  formData.value.password = '';
  formData.value.confirmPassword = '';
  showMessage('密码更改成功', 'success');
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
          <a href="#/profile" class="nav-link active">个人中心</a>
          <a href="#/api-keys" class="nav-link">API 密钥</a>
        </nav>
        <div class="user-actions">
          <button class="logout-btn">退出登录</button>
        </div>
      </div>
    </header>
    
    <!-- 主要内容区域 -->
    <main class="profile-main">
      <div class="profile-container">
        <!-- 左侧侧边栏 -->
        <aside class="profile-sidebar">
          <div class="profile-card">
            <div class="profile-avatar">
              {{ user.avatar }}
            </div>
            <h2 class="profile-name">{{ user.name }}</h2>
            <p class="profile-email">{{ user.email }}</p>
            <div class="profile-meta">
              <div class="meta-item">
                <span class="meta-label">注册时间</span>
                <span class="meta-value">{{ user.memberSince }}</span>
              </div>
            </div>
          </div>
          
          <div class="usage-stats">
            <h3>使用统计</h3>
            <div class="stat-item">
              <span class="stat-label">API 调用次数</span>
              <span class="stat-value">{{ user.usage.apiCalls }} / 10,000</span>
              <div class="stat-progress">
                <div 
                  class="stat-bar" 
                  :style="{ width: `${(user.usage.apiCalls / 10000) * 100}%` }"
                ></div>
              </div>
            </div>
            <div class="stat-item">
              <span class="stat-label">剩余调用次数</span>
              <span class="stat-value">{{ user.usage.remainingCalls }}</span>
            </div>
            <div class="stat-item">
              <span class="stat-label">存储使用</span>
              <span class="stat-value">{{ user.usage.storageUsed }}</span>
            </div>
          </div>
        </aside>
        
        <!-- 右侧内容 -->
        <div class="profile-content">
          <!-- 消息提示 -->
          <div 
            v-if="message" 
            class="message" 
            :class="messageType"
          >
            {{ message }}
          </div>
          
          <!-- 个人信息表单 -->
          <div class="profile-section">
            <h2 class="section-title">个人信息</h2>
            <form class="profile-form" @submit.prevent="saveProfile">
              <div class="form-row">
                <div class="form-group">
                  <label class="form-label">姓名</label>
                  <input 
                    type="text" 
                    class="form-input" 
                    v-model="formData.name"
                    placeholder="请输入您的姓名"
                  >
                </div>
                <div class="form-group">
                  <label class="form-label">邮箱</label>
                  <input 
                    type="email" 
                    class="form-input" 
                    v-model="formData.email"
                    disabled
                  >
                </div>
              </div>
              <div class="form-actions">
                <button type="submit" class="primary-btn">保存更改</button>
              </div>
            </form>
          </div>
          
          <!-- 密码更改表单 -->
          <div class="profile-section">
            <h2 class="section-title">更改密码</h2>
            <form class="profile-form" @submit.prevent="changePassword">
              <div class="form-row">
                <div class="form-group">
                  <label class="form-label">新密码</label>
                  <input 
                    type="password" 
                    class="form-input" 
                    v-model="formData.password"
                    placeholder="请输入新密码"
                    minlength="6"
                  >
                </div>
                <div class="form-group">
                  <label class="form-label">确认密码</label>
                  <input 
                    type="password" 
                    class="form-input" 
                    v-model="formData.confirmPassword"
                    placeholder="请再次输入新密码"
                    minlength="6"
                  >
                </div>
              </div>
              <div class="form-actions">
                <button type="submit" class="primary-btn">更改密码</button>
              </div>
            </form>
          </div>
          
          <!-- 账户设置 -->
          <div class="profile-section">
            <h2 class="section-title">账户设置</h2>
            <div class="settings-list">
              <div class="setting-item">
                <div class="setting-info">
                  <h4>通知设置</h4>
                  <p>接收有关API使用情况和更新的通知</p>
                </div>
                <label class="toggle-switch">
                  <input type="checkbox" checked>
                  <span class="toggle-slider"></span>
                </label>
              </div>
              <div class="setting-item">
                <div class="setting-info">
                  <h4>自动续订</h4>
                  <p>自动续订您的订阅计划</p>
                </div>
                <label class="toggle-switch">
                  <input type="checkbox" checked>
                  <span class="toggle-slider"></span>
                </label>
              </div>
              <div class="setting-item">
                <div class="setting-info">
                  <h4>数据收集</h4>
                  <p>允许我们收集匿名使用数据以改进服务</p>
                </div>
                <label class="toggle-switch">
                  <input type="checkbox">
                  <span class="toggle-slider"></span>
                </label>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<style scoped>
/* 个人中心页面样式 */
.app-container {
  width: 100%;
  min-height: 100vh;
  background-color: var(--bg-color);
  display: flex;
  flex-direction: column;
}

/* 主要内容区域 */
.profile-main {
  max-width: 1400px;
  margin: 0 auto;
  padding: 2rem;
  flex: 1;
}

.profile-container {
  display: grid;
  grid-template-columns: 320px 1fr;
  gap: 2rem;
  align-items: start;
}

/* 左侧侧边栏 */
.profile-sidebar {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.profile-card {
  background-color: var(--card-bg);
  border-radius: 16px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  padding: 2rem;
  text-align: center;
}

.profile-avatar {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  background-color: var(--tiffany-blue);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 3em;
  margin: 0 auto 1.5rem;
}

.profile-name {
  font-size: 1.5em;
  font-weight: 700;
  color: var(--text-color);
  margin-bottom: 0.5rem;
}

.profile-email {
  color: #666;
  margin-bottom: 1.5rem;
}

.profile-meta {
  margin-top: 1.5rem;
  padding-top: 1.5rem;
  border-top: 1px solid var(--border-color);
}

.meta-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;
  font-size: 0.9em;
}

.meta-label {
  color: #666;
}

.meta-value {
  font-weight: 600;
  color: var(--text-color);
}

/* 使用统计 */
.usage-stats {
  background-color: var(--card-bg);
  border-radius: 16px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  padding: 1.5rem;
}

.usage-stats h3 {
  font-size: 1.1em;
  font-weight: 700;
  color: var(--text-color);
  margin-bottom: 1.5rem;
}

.stat-item {
  margin-bottom: 1.5rem;
}

.stat-item:last-child {
  margin-bottom: 0;
}

.stat-label {
  display: block;
  font-size: 0.9em;
  color: #666;
  margin-bottom: 0.5rem;
}

.stat-value {
  display: block;
  font-size: 1.2em;
  font-weight: 600;
  color: var(--text-color);
  margin-bottom: 0.5rem;
}

.stat-progress {
  width: 100%;
  height: 8px;
  background-color: #f0f8ff;
  border-radius: 4px;
  overflow: hidden;
}

.stat-bar {
  height: 100%;
  background-color: var(--tiffany-blue);
  border-radius: 4px;
  transition: width 0.3s ease;
}

/* 右侧内容 */
.profile-content {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.profile-section {
  background-color: var(--card-bg);
  border-radius: 16px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  padding: 2rem;
}

.section-title {
  font-size: 1.5em;
  font-weight: 700;
  color: var(--text-color);
  margin-bottom: 2rem;
}

/* 表单样式 */
.profile-form {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.form-row {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1.5rem;
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

.form-input:disabled {
  background-color: #f5f5f5;
  cursor: not-allowed;
  opacity: 0.7;
}

/* 表单操作按钮 */
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

/* 设置列表 */
.settings-list {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.setting-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem;
  background-color: #f0f8ff;
  border-radius: 12px;
  transition: all 0.3s ease;
}

.setting-item:hover {
  background-color: rgba(0, 180, 216, 0.1);
}

.setting-info h4 {
  font-weight: 600;
  color: var(--text-color);
  margin-bottom: 0.5rem;
}

.setting-info p {
  color: #666;
  font-size: 0.9em;
  margin: 0;
}

/* 开关样式 */
.toggle-switch {
  position: relative;
  display: inline-block;
  width: 60px;
  height: 34px;
  cursor: pointer;
}

.toggle-switch input {
  opacity: 0;
  width: 0;
  height: 0;
}

.toggle-slider {
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #ccc;
  transition: .4s;
  border-radius: 34px;
}

.toggle-slider:before {
  position: absolute;
  content: "";
  height: 26px;
  width: 26px;
  left: 4px;
  bottom: 4px;
  background-color: white;
  transition: .4s;
  border-radius: 50%;
}

input:checked + .toggle-slider {
  background-color: var(--tiffany-blue);
}

input:focus + .toggle-slider {
  box-shadow: 0 0 1px var(--tiffany-blue);
}

input:checked + .toggle-slider:before {
  transform: translateX(26px);
}

/* 响应式设计 */
@media (max-width: 1024px) {
  .profile-container {
    grid-template-columns: 1fr;
  }
  
  .profile-sidebar {
    order: -1;
  }
}

@media (max-width: 768px) {
  .profile-main {
    padding: 1rem;
  }
  
  .profile-section {
    padding: 1.5rem;
  }
  
  .form-row {
    grid-template-columns: 1fr;
  }
  
  .setting-item {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }
}
</style>