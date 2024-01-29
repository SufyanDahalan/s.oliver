import { fileURLToPath, URL } from 'node:url'

import { defineConfig, loadEnv, UserConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default (mode: string): UserConfig => {
  process.env = { ...process.env, ...loadEnv(mode, process.cwd()) }
  
  return defineConfig({
    plugins: [vue()],
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url))
      }
    },
    server: {
      proxy: {
        '/api': {
          target: `${process.env.VITE_API_BASE_URL}`,
          changeOrigin: true,
          rewrite: path => path.replace('/api', '')
        }
      }
    }
    
  })
}
