<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';

const router = useRouter();
const route = useRoute();

/**
 * 初始化黑色主题
 */
onMounted(() => {
  // 始终使用黑色主题，移除主题切换功能
  localStorage.setItem('theme', 'dark');
});

/**
 * 处理登出
 */
const handleLogout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  router.push('/login');
};

/**
 * 检查用户是否已登录
 */
const isLoggedIn = computed(() => {
  return !!localStorage.getItem('token');
});
</script>

<template>
  <div id="app" class="app-container">
    <!-- 导航栏 -->
    <nav class="navbar">
      <div class="navbar-container">
        <div class="navbar-brand">
          <router-link to="/" class="brand-link">OiiOii AI</router-link>
        </div>
        
        <div class="navbar-menu">
          <router-link 
            to="/" 
            class="nav-link"
            :class="{ 'active': route.path === '/' }"
          >
            首页
          </router-link>
          
          <template v-if="isLoggedIn">
            <router-link 
              to="/app" 
              class="nav-link"
              :class="{ 'active': route.path === '/app' }"
            >
              AI 动画生成
            </router-link>
            <router-link 
              to="/api-keys" 
              class="nav-link"
              :class="{ 'active': route.path === '/api-keys' }"
            >
              API 密钥
            </router-link>
            <router-link 
              to="/profile" 
              class="nav-link"
              :class="{ 'active': route.path === '/profile' }"
            >
              个人中心
            </router-link>
          </template>
          

          
          <template v-if="isLoggedIn">
            <button 
              class="nav-button logout-button"
              @click="handleLogout"
            >
              退出登录
            </button>
          </template>
          
          <template v-else>
            <router-link 
              to="/login" 
              class="nav-link"
              :class="{ 'active': route.path === '/login' }"
            >
              登录
            </router-link>
            <router-link 
              to="/register" 
              class="nav-button register-button"
              :class="{ 'active': route.path === '/register' }"
            >
              注册
            </router-link>
          </template>
        </div>
      </div>
    </nav>
    
    <!-- 路由视图 -->
    <main class="main-content">
      <router-view />
    </main>
    
    <!-- 页脚 -->
    <footer class="footer">
      <div class="footer-container">
        <p>&copy; {{ new Date().getFullYear() }} OiiOii AI. All rights reserved.</p>
      </div>
    </footer>
  </div>
</template>

<style scoped>
/* 应用容器 */
.app-container {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
    'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue',
    sans-serif;
  background-color: var(--bg-color);
  color: var(--text-primary);
  transition: background-color 0.3s ease, color 0.3s ease;
}

/* 导航栏 */
.navbar {
  background-color: var(--card-bg);
  box-shadow: var(--shadow-md);
  position: sticky;
  top: 0;
  z-index: 1000;
  transition: all 0.3s ease;
}

.navbar-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 70px;
}

.navbar-brand {
  display: flex;
  align-items: center;
}

.brand-link {
  font-size: 1.8rem;
  font-weight: 800;
  background: linear-gradient(135deg, var(--primary-color) 0%, var(--secondary-color) 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  text-decoration: none;
  transition: all 0.3s ease;
}

.brand-link:hover {
  transform: scale(1.05);
}

.navbar-menu {
  display: flex;
  align-items: center;
  gap: 20px;
}

.nav-link {
  color: var(--text-secondary);
  text-decoration: none;
  font-weight: 500;
  padding: 8px 16px;
  border-radius: 25px;
  transition: all 0.3s ease;
  position: relative;
}

.nav-link:hover {
  color: var(--primary-color);
  background-color: var(--primary-color-pale);
  transform: scale(1.05);
}

.nav-link.active {
  color: var(--primary-color);
  background-color: var(--primary-color-pale);
}

.nav-button {
  padding: 10px 24px;
  border-radius: 25px;
  font-weight: 600;
  text-decoration: none;
  transition: all 0.3s ease;
  border: none;
  cursor: pointer;
  font-size: 1rem;
  font-family: inherit;
}

.register-button {
  background: linear-gradient(135deg, var(--primary-color) 0%, var(--secondary-color) 100%);
  color: white;
}

.register-button:hover {
  background: linear-gradient(135deg, var(--primary-color-dark) 0%, var(--secondary-color) 100%);
  transform: translateY(-3px);
  box-shadow: var(--shadow-lg);
}

.logout-button {
  background-color: transparent;
  color: var(--error-color);
  border: 1px solid var(--error-color);
}

.logout-button:hover {
  background-color: var(--error-color);
  color: white;
}

/* 主题切换容器样式 */
.theme-switch-container {
  display: flex;
  align-items: center;
  padding: 0 8px;
}

/* 主要内容 */
.main-content {
  flex: 1;
  width: 100%;
  margin: 0;
  padding: 0;
}

/* 页脚 */
.footer {
  background-color: var(--card-bg);
  padding: 20px 0;
  margin-top: auto;
  border-top: 1px solid var(--border-color);
  transition: all 0.3s ease;
}

.footer-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
  text-align: center;
  color: var(--text-muted);
  font-size: 0.9rem;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .navbar-container {
    padding: 0 15px;
  }
  
  .navbar-menu {
    gap: 10px;
  }
  
  .nav-link {
    padding: 6px 12px;
    font-size: 0.9rem;
  }
  
  .nav-button {
    padding: 8px 16px;
    font-size: 0.9rem;
  }
  
  /* 移除main-content的padding，避免影响全屏背景 */
}
</style>
