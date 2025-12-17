<script setup>
import { ref } from 'vue';
import axios from 'axios';

const username = ref('');
const password = ref('');
const message = ref('');
const isError = ref(false);

/**
 * 处理登录表单提交
 */
const handleLogin = async () => {
  if (!username.value || !password.value) {
    message.value = '请输入用户名和密码';
    isError.value = true;
    return;
  }

  try {
    const res = await axios.post('/api/login', {
      username: username.value,
      password: password.value
    });
    
    // 存储JWT令牌到localStorage
    localStorage.setItem('token', res.data.token);
    message.value = res.data.message;
    isError.value = false;
    
    // 登录成功后跳转到首页
    window.location.href = '#/';
  } catch (err) {
    message.value = err.response?.data?.error || '登录失败，请稍后重试';
    isError.value = true;
  }
};
</script>

<template>
  <div class="auth-container">
    <div class="auth-left">
      <div class="auth-left-content">
        <h1 class="auth-logo">OiiOii</h1>
        <p class="auth-slogan">Director, we are your professional AI animation agent team.</p>
        <div class="team-roles">
          <div class="role-item">艺术总监</div>
          <div class="role-item">场景设计师</div>
          <div class="role-item">编剧</div>
          <div class="role-item">产品设计师</div>
          <div class="role-item">角色设计师</div>
          <div class="role-item">分镜师</div>
          <div class="role-item">音乐总监</div>
        </div>
      </div>
    </div>
    <div class="auth-right">
      <div class="auth-card">
        <h1 class="auth-title">欢迎回来 👋</h1>
        <p class="auth-subtitle">一键创建你的资产与动画</p>
        
        <div v-if="message" :class="['message', isError ? 'error' : 'success']">
          {{ message }}
        </div>
        
        <form class="auth-form" @submit.prevent="handleLogin">
          <div class="form-group">
            <label for="username" class="form-label">邮箱</label>
            <input
              type="email"
              id="username"
              v-model="username"
              class="form-input"
              placeholder="请输入邮箱"
              required
            />
          </div>
          
          <div class="form-group">
            <div class="password-row">
              <label for="password" class="form-label">密码</label>
              <a href="#" class="forgot-password">忘记密码？</a>
            </div>
            <input
              type="password"
              id="password"
              v-model="password"
              class="form-input"
              placeholder="请输入密码"
              required
            />
          </div>
          
          <div class="form-group checkbox-group">
            <input type="checkbox" id="agree" required />
            <label for="agree" class="checkbox-label">
              我同意 <a href="#" class="link">服务条款</a> 与 <a href="#" class="link">隐私政策</a>
            </label>
          </div>
          
          <button type="submit" class="auth-button">登录</button>
        </form>
        
        <div class="auth-switch">
          没有账号？ <a href="#/register" class="switch-link">去注册</a>
        </div>
        
        <div class="auth-footer">
          © 2025 OiiOii 保留所有权利
        </div>
      </div>
    </div>
  </div>
</template>
