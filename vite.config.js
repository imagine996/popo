import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue()],
  // 构建优化配置
  build: {
    // 启用代码分割
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          // 将第三方库分离到独立的 chunk
          if (id.includes('node_modules')) {
            return 'vendor';
          }
        },
      },
    },
    // 启用CSS代码分割
    cssCodeSplit: true,
    // 启用CSS压缩
    minify: 'esbuild',
    // 生成sourcemap，便于调试（生产环境可关闭）
    sourcemap: false,
    // 启用brotli压缩
    brotliSize: true,
    // 启用gzip压缩
    chunkSizeWarningLimit: 1000, // 调整chunk大小警告阈值
  },
  // 开发服务器优化
  server: {
    // 启用gzip压缩
    compress: true,
  },
})
