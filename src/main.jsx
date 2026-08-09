import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.jsx';

// 백엔드가 준비되기 전에는 .env 의 VITE_USE_MOCK=true 로 목 서버를 켜서 화면을 테스트한다.
async function enableMocking() {
	if (import.meta.env.VITE_USE_MOCK !== 'true') return;

	const { worker } = await import('./mocks/browser');
	await worker.start({ onUnhandledRequest: 'bypass' });
}

enableMocking().then(() => {
	createRoot(document.getElementById('root')).render(
		<StrictMode>
			<App />
		</StrictMode>,
	);
});
