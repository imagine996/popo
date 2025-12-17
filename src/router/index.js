import { createRouter, createWebHistory } from 'vue-router'

// 使用懒加载实现代码分割
const Home = () => import('../views/Home.vue')
const Login = () => import('../views/Login.vue')
const Register = () => import('../views/Register.vue')
const AIApp = () => import('../views/AIApp.vue')
const ApiKeys = () => import('../views/ApiKeys.vue')
const Profile = () => import('../views/Profile.vue')

// 创建路由实例
const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'Home',
      component: Home
    },
    {
      path: '/login',
      name: 'Login',
      component: Login
    },
    {
      path: '/register',
      name: 'Register',
      component: Register
    },
    {
      path: '/app',
      name: 'AIApp',
      component: AIApp,
      meta: {
        requiresAuth: true
      }
    },
    {
      path: '/api-keys',
      name: 'ApiKeys',
      component: ApiKeys,
      meta: {
        requiresAuth: true
      }
    },
    {
      path: '/profile',
      name: 'Profile',
      component: Profile,
      meta: {
        requiresAuth: true
      }
    }
  ]
})

// 路由守卫，用于保护需要认证的路由
router.beforeEach((to, from, next) => {
  const isAuthenticated = localStorage.getItem('token')
  if (to.matched.some(record => record.meta.requiresAuth) && !isAuthenticated) {
    next('/login')
  } else {
    next()
  }
})

export default router
