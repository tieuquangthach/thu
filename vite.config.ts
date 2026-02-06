import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: './', // Thêm dòng này để đường dẫn file (CSS, JS) luôn đúng trên Vercel/GitHub
})
