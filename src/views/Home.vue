<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const userInfo = ref(null);
const message = ref('');

/**
 * 获取用户信息
 */
const fetchUserInfo = async () => {
  const token = localStorage.getItem('token');
  if (!token) {
    message.value = '';
    return;
  }

  try {
    // 这里可以调用需要认证的API
    message.value = '';
    userInfo.value = {
      username: '张三'
    };
  } catch (err) {
    message.value = '获取用户信息失败';
    localStorage.removeItem('token');
  }
};

onMounted(() => {
  fetchUserInfo();
});
</script>

<template>
  <div class="home-container">
    <!-- 英雄区域 -->
    <section class="hero-section">
      <div class="hero-content">
        <h1 class="hero-title">OiiOii AI</h1>
        <p class="hero-subtitle">智能、高效、便捷的AI动画生成平台</p>
        <p class="hero-description">
          基于先进的人工智能技术，为您提供高质量的AI动画生成服务，轻松创建专业级动画作品。
        </p>
        <div class="hero-actions">
          <button class="primary-btn" @click="router.push('/app')">立即体验</button>
          <button class="secondary-btn" @click="router.push('/register')">免费注册</button>
        </div>
      </div>
      <div class="hero-visual">
        <div class="visual-card">
          <div class="visual-icon">🎬</div>
          <div class="visual-text">AI 动画生成</div>
        </div>
      </div>
    </section>
    
    <!-- 消息提示 -->
    <div v-if="message" class="message" :class="message.includes('失败') ? 'error' : 'success'">
      {{ message }}
    </div>
    
    <!-- 特色功能 -->
    <section class="features-section">
      <h2 class="section-title">核心功能</h2>
      <div class="features-grid">
        <div class="feature-card">
          <div class="feature-icon">✍️</div>
          <h3 class="feature-title">文本生成动画</h3>
          <p class="feature-description">
            通过简单的文本描述，自动生成生动有趣的动画内容。
          </p>
        </div>
        <div class="feature-card">
          <div class="feature-icon">🎨</div>
          <h3 class="feature-title">图像转动画</h3>
          <p class="feature-description">
            将静态图像转换为动态动画，赋予图像新的生命力。
          </p>
        </div>
        <div class="feature-card">
          <div class="feature-icon">⚡</div>
          <h3 class="feature-title">快速生成</h3>
          <p class="feature-description">
            高效的AI处理引擎，快速生成高质量动画作品。
          </p>
        </div>
        <div class="feature-card">
          <div class="feature-icon">🎯</div>
          <h3 class="feature-title">精准控制</h3>
          <p class="feature-description">
            提供丰富的参数调节，实现精准的动画效果控制。
          </p>
        </div>
      </div>
    </section>
    
    <!-- 使用统计 -->
    <section class="stats-section">
      <div class="stats-container">
        <div class="stat-card">
          <div class="stat-number">10,000+</div>
          <div class="stat-label">活跃用户</div>
        </div>
        <div class="stat-card">
          <div class="stat-number">100,000+</div>
          <div class="stat-label">动画生成</div>
        </div>
        <div class="stat-card">
          <div class="stat-number">99.9%</div>
          <div class="stat-label">服务可用性</div>
        </div>
        <div class="stat-card">
          <div class="stat-number">24/7</div>
          <div class="stat-label">技术支持</div>
        </div>
      </div>
    </section>
    
    <!-- CTA 区域 -->
    <section class="cta-section">
      <div class="cta-content">
        <h2 class="cta-title">开始您的AI动画之旅</h2>
        <p class="cta-description">
          立即注册，体验强大的AI动画生成服务，释放您的创造力。
        </p>
        <button class="primary-btn" @click="router.push('/register')">免费注册</button>
      </div>
    </section>
  </div>
</template>

<style scoped>
/* 首页样式 */
.home-container {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 6rem;
}

/* 英雄区域 */
.hero-section {
  background-color: var(--card-bg);
  padding: 6rem 2rem;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 4rem;
  align-items: center;
  justify-items: center;
  border-radius: 32px;
  box-shadow: var(--shadow-md);
}

.hero-content {
  max-width: 600px;
}

.hero-title {
  font-size: 4rem;
  font-weight: 800;
  background: linear-gradient(135deg, var(--tiffany-blue), var(--tiffany-blue-light));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin-bottom: 1.5rem;
  line-height: 1.2;
}

.hero-subtitle {
  font-size: 1.5rem;
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: 1.5rem;
}

.hero-description {
  font-size: 1.1rem;
  color: var(--text-secondary);
  margin-bottom: 3rem;
  line-height: 1.7;
}

.hero-actions {
  display: flex;
  gap: 1.5rem;
  flex-wrap: wrap;
}

.primary-btn, .secondary-btn {
  padding: 14px 32px;
  border-radius: 16px;
  font-weight: 700;
  font-size: 1.1rem;
  transition: var(--transition);
  cursor: pointer;
  border: none;
  font-family: inherit;
}

.primary-btn {
  background: linear-gradient(135deg, var(--tiffany-blue), var(--tiffany-blue-light));
  color: white;
  box-shadow: 0 8px 24px rgba(10, 186, 181, 0.3);
}

.primary-btn:hover {
  transform: translateY(-3px);
  box-shadow: 0 12px 32px rgba(10, 186, 181, 0.4);
}

.secondary-btn {
  background-color: transparent;
  color: var(--tiffany-blue);
  border: 2px solid var(--tiffany-blue);
}

.secondary-btn:hover {
  background-color: var(--tiffany-blue);
  color: white;
  transform: translateY(-2px);
}

/* 英雄视觉效果 */
.hero-visual {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
}

.visual-card {
  width: 350px;
  height: 350px;
  background: linear-gradient(135deg, var(--tiffany-blue), var(--tiffany-blue-light));
  border-radius: 32px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  color: white;
  font-size: 5rem;
  animation: float 3s ease-in-out infinite;
  box-shadow: 0 16px 48px rgba(10, 186, 181, 0.4);
}

.visual-text {
  font-size: 0.25em;
  font-weight: 600;
  margin-top: 1rem;
  text-align: center;
}

@keyframes float {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-20px);
  }
}

/* 特色功能 */
.features-section {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.section-title {
  font-size: 2.5rem;
  font-weight: 700;
  color: var(--text-primary);
  text-align: center;
  margin-bottom: 3rem;
}

.features-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
  width: 100%;
}

.feature-card {
  background-color: var(--card-bg);
  border-radius: 20px;
  padding: 2.5rem;
  box-shadow: var(--shadow-sm);
  transition: var(--transition);
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
  align-items: center;
  text-align: center;
  border: 1px solid var(--border-color);
}

.feature-card:hover {
  transform: translateY(-5px);
  box-shadow: var(--shadow-lg);
  border-color: var(--tiffany-blue);
}

.feature-icon {
  font-size: 3rem;
  background: linear-gradient(135deg, var(--tiffany-blue), var(--tiffany-blue-light));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.feature-title {
  font-size: 1.3rem;
  font-weight: 700;
  color: var(--text-primary);
}

.feature-description {
  color: var(--text-secondary);
  line-height: 1.7;
}

/* 统计数据 */
.stats-section {
  background-color: var(--tiffany-blue-pale);
  padding: 5rem 2rem;
  border-radius: 32px;
}

.stats-container {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 3rem;
  justify-items: center;
}

.stat-card {
  text-align: center;
  padding: 2.5rem;
  background-color: var(--card-bg);
  border-radius: 20px;
  box-shadow: var(--shadow-sm);
  transition: var(--transition);
  border: 1px solid var(--border-color);
  min-width: 200px;
}

.stat-card:hover {
  transform: translateY(-4px);
  box-shadow: var(--shadow-md);
}

.stat-number {
  font-size: 2.8rem;
  font-weight: 800;
  color: var(--tiffany-blue);
  margin-bottom: 0.5rem;
}

.stat-label {
  color: var(--text-secondary);
  font-weight: 600;
  font-size: 1rem;
}

/* CTA 区域 */
.cta-section {
  background: linear-gradient(135deg, var(--tiffany-blue), var(--tiffany-blue-light));
  color: white;
  padding: 6rem 2rem;
  border-radius: 32px;
  text-align: center;
  box-shadow: var(--shadow-lg);
}

.cta-content {
  max-width: 800px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  align-items: center;
}

.cta-title {
  font-size: 2.5rem;
  font-weight: 700;
  margin: 0;
  line-height: 1.2;
}

.cta-description {
  font-size: 1.2rem;
  opacity: 0.95;
  margin: 0;
  line-height: 1.7;
}

.cta-section .primary-btn {
  background-color: white;
  color: var(--tiffany-blue);
  box-shadow: 0 8px 24px rgba(255, 255, 255, 0.3);
  margin-top: 1rem;
}

.cta-section .primary-btn:hover {
  transform: translateY(-3px);
  box-shadow: 0 12px 32px rgba(255, 255, 255, 0.4);
  background-color: rgba(255, 255, 255, 0.95);
}

/* 消息提示 */
.message {
  max-width: 800px;
  margin: 0 auto;
  padding: 16px 24px;
  border-radius: 12px;
  font-weight: 600;
  text-align: center;
  animation: fadeIn 0.3s ease-out;
}

.message.success {
  background-color: rgba(56, 161, 105, 0.1);
  color: var(--success-color);
  border: 1px solid rgba(56, 161, 105, 0.3);
}

.message.error {
  background-color: rgba(245, 101, 101, 0.1);
  color: var(--error-color);
  border: 1px solid rgba(245, 101, 101, 0.3);
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* 响应式设计 */
@media (max-width: 1024px) {
  .hero-section {
    grid-template-columns: 1fr;
    text-align: center;
  }
  
  .hero-visual {
    order: -1;
  }
  
  .hero-actions {
    justify-content: center;
  }
  
  .features-grid {
    grid-template-columns: repeat(2, 1fr);
  }
  
  .stats-container {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 768px) {
  .home-container {
    gap: 4rem;
  }
  
  .hero-section {
    padding: 4rem 1.5rem;
    gap: 2rem;
  }
  
  .hero-title {
    font-size: 2.8rem;
  }
  
  .hero-subtitle {
    font-size: 1.3rem;
  }
  
  .hero-actions {
    flex-direction: column;
    align-items: center;
  }
  
  .visual-card {
    width: 250px;
    height: 250px;
    font-size: 4rem;
  }
  
  .section-title {
    font-size: 2rem;
  }
  
  .features-grid {
    grid-template-columns: 1fr;
  }
  
  .stats-container {
    grid-template-columns: 1fr;
  }
  
  .stats-section {
    padding: 4rem 1.5rem;
  }
  
  .cta-section {
    padding: 4rem 1.5rem;
  }
  
  .cta-title {
    font-size: 2rem;
  }
}

@media (max-width: 480px) {
  .hero-title {
    font-size: 2.4rem;
  }
  
  .visual-card {
    width: 200px;
    height: 200px;
    font-size: 3.5rem;
  }
  
  .primary-btn, .secondary-btn {
    padding: 12px 24px;
    font-size: 1rem;
  }
}
</style>