import { defineConfig } from 'vite';
import laravel from 'laravel-vite-plugin';

export default defineConfig({
export default {
  server: {
    host: '0.0.0.0', // Permite acesso externo (do host)
    port: 3000       // Define o porto como 3000
  }
}
    plugins: [
        laravel({
            input: ['resources/css/app.css', 'resources/js/app.js'],
            refresh: true,
        }),
    ],
});
