import axios from 'axios';
import { useAuthStore } from '../store/authStore';
import { endSession } from '../store/session';
import { camelizeKeys, normalizeResponse } from './normalize';

const API_BASE = import.meta.env.VITE_API_BASE_URL ?? '/api';

/**
 * 활동이력만 /api 밖(서버 루트)에 있어서, baseURL 에서 끝의 /api 를 떼어 낸 주소가 필요하다.
 * 개발 프록시('/api')면 빈 문자열이 되므로 '/' 로 되돌려 같은 오리진을 가리키게 한다.
 * (백엔드에 경로 통일을 요청해 둔 상태 — 통일되면 이건 지운다.)
 */
export const API_ROOT = API_BASE.replace(/\/api\/?$/, '') || '/';

export const apiClient = axios.create({
	baseURL: API_BASE,
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
	(response) => {
		// 키를 camelCase 로 맞추고 { success, data, error } 봉투를 벗긴다.
		// 화면은 어느 엔드포인트가 봉투를 쓰는지 몰라도 된다.
		response.data = normalizeResponse(response.data);
		return response;
	},
	async (error) => {
		const original = error.config;
		const isRefreshCall = original?.url?.includes('/auth/refresh');
		const { refreshToken } = useAuthStore.getState();

		if (
			error.response?.status !== 401 ||
			original?._retried ||
			isRefreshCall ||
			!refreshToken
		) {
			return Promise.reject(error);
		}

		original._retried = true;

		try {
			refreshRequest = refreshRequest ?? apiClient.post('/auth/refresh', { refreshToken });
			const { data } = await refreshRequest;
			useAuthStore.getState().setAccessToken(data.accessToken);
			return apiClient(original);
		} catch (refreshError) {
			endSession();
			return Promise.reject(refreshError);
		} finally {
			refreshRequest = null;
		}
	},
);

/**
 * 에러 응답에서 사람이 읽을 문구만 꺼낸다.
 *
 * 두 가지 모양이 섞여 온다.
 *   { status, error, message }                  auth·활동이력 계열
 *   { success: false, error: { code, message } } 봉투를 쓰는 계열
 * 실패 응답은 성공 인터셉터를 안 타므로 여기서 직접 본다.
 */
export function messageOf(error, fallback) {
	const body = camelizeKeys(error?.response?.data);
	return body?.error?.message ?? body?.message ?? fallback;
}
