import axios from 'axios';
import { useAuthStore } from '../store/authStore';

export const apiClient = axios.create({
	baseURL: import.meta.env.VITE_API_BASE_URL ?? '/api',
	withCredentials: true,
	timeout: 15000,
});

apiClient.interceptors.request.use((config) => {
	const { accessToken } = useAuthStore.getState();
	if (accessToken) {
		config.headers.Authorization = `Bearer ${accessToken}`;
	}
	return config;
});

// 동시에 여러 요청이 401 을 받아도 refresh 는 한 번만 호출되도록 공유한다.
let refreshRequest = null;

apiClient.interceptors.response.use(
	(response) => response,
	async (error) => {
		const original = error.config;
		const isRefreshCall = original?.url?.includes('/auth/refresh');

		if (error.response?.status !== 401 || original?._retried || isRefreshCall) {
			return Promise.reject(error);
		}

		original._retried = true;

		try {
			refreshRequest = refreshRequest ?? apiClient.post('/auth/refresh');
			const { data } = await refreshRequest;
			useAuthStore.getState().setAccessToken(data.accessToken);
			return apiClient(original);
		} catch (refreshError) {
			useAuthStore.getState().signOut();
			return Promise.reject(refreshError);
		} finally {
			refreshRequest = null;
		}
	},
);
