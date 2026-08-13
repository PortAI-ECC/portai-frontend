import js from '@eslint/js';
import globals from 'globals';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import { defineConfig, globalIgnores } from 'eslint/config';
import prettier from 'eslint-config-prettier'; //Flat Config 방식에서는 반드시 import로 불러와야함.

export default defineConfig([
	// mockServiceWorker.js 는 MSW 가 생성하는 파일이라 린트 대상이 아니다.
	globalIgnores(['dist', 'public/mockServiceWorker.js']),
	{
		files: ['**/*.{js,jsx}'],
		extends: [
			js.configs.recommended,
			reactHooks.configs.flat.recommended,
			reactRefresh.configs.vite,
			prettier, //ESLint와 Prettier 규칙 충돌이 사라지도록 Prettier를 extends에 추가.
		],
		languageOptions: {
			globals: globals.browser,
			parserOptions: { ecmaFeatures: { jsx: true } },
		},
		rules: {
			// 기본적인 코드 품질 규칙
			'no-unused-vars': 'warn', // 사용하지 않는 변수 경고
			eqeqeq: 'error', // == 대신 === 강제
			'no-console': 'warn', // console.log 사용 시 경고
		},
		settings: {
			prettier: {
				tabWidth: 4, // 들여쓰기 4칸
				semi: true, // 세미콜론 강제
				singleQuote: true, // 작은따옴표 사용
				trailingComma: 'all', // 마지막 항목에도 콤마
				useTabs: true, // 스페이스 대신 탭 사용
			},
		},
	},
]);
