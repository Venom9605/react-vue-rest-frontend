import { defineConfig } from 'vite';

export default defineConfig({
    base: './', // Use relative paths for assets
    server: {
        port: 3000, // Optional: Set the development server port
    },
});