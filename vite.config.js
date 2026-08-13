import process from 'node:process';
import { defineConfig } from 'vite';
import react, { reactCompilerPreset } from '@vitejs/plugin-react';
import babel from '@rolldown/plugin-babel';

// https://vite.dev/config/
export default defineConfig({
	plugins: [react(), babel({ presets: [reactCompilerPreset()] })],
	server: {
		proxy: {
			// VITE_API_BASE_URL 을 따로 주지 않으면 /api 요청을 로컬 백엔드로 넘긴다.
			'/api': {
				target: process.env.VITE_DEV_API_TARGET ?? 'http://localhost:8080',
				changeOrigin: true,
			},
		},
	},
});
