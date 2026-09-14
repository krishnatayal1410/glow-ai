import{defineConfig}from'vite';
import react from'@vitejs/plugin-react';
import{fileURLToPath,URL}from'node:url';
export default defineConfig({
 plugins:[react()],
 base:'./',
 build:{
  target:'es2022',
  sourcemap:true,
  chunkSizeWarningLimit:1400,
  rollupOptions:{input:{main:fileURLToPath(new URL('./index.html',import.meta.url)),app:fileURLToPath(new URL('./app.html',import.meta.url))}}
 }
});
