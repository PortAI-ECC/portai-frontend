import { API_ROOT, apiClient, currentUserId } from './client';
import { listOf } from './normalize';

// 공모전·인턴/경력·자격증·교육·활동이력은 모두 동일한 CRUD 형태라 하나로 묶는다.
//
// 목록 응답 모양이 리소스마다 다르다({ careers: [...] } / 맨 배열 / 봉투). 어느 쪽이
// 오든 listOf 가 배열 하나로 만들어 주므로 화면은 신경 쓰지 않아도 된다.
// 수정 메서드도 리소스마다 PATCH·PUT 으로 갈려 있어 인자로 받는다.
const createRecordApi = (resource, listKey, { updateMethod = 'patch' } = {}) => ({
	listKey,
	list: (params) => apiClient.get(`/${resource}`, { params }).then((r) => r.data),
	listItems: (params) =>
		apiClient.get(`/${resource}`, { params }).then((r) => listOf(r.data, listKey)),
	create: (payload) => apiClient.post(`/${resource}`, payload).then((r) => r.data),
	update: (id, payload) =>
		apiClient[updateMethod](`/${resource}/${id}`, payload).then((r) => r.data),
	remove: (id) => apiClient.delete(`/${resource}/${id}`).then((r) => r.data),
});

export const contestsApi = createRecordApi('contests', 'contests');
export const careersApi = createRecordApi('careers', 'careers');
export const certificatesApi = createRecordApi('certificates', 'certificates');
export const educationApi = createRecordApi('education', 'education');

// 활동이력만 /api 밖(서버 루트)에 있고, 목록도 /me 로 따로 논다. 수정은 PATCH 가 아니라 PUT.
// 게다가 이것만 userId 를 쿼리로 직접 받는다 — 다른 엔드포인트는 토큰에서 꺼내지만
// 활동이력은 빠뜨리면 500 이 떨어진다(2026-08-15 실측).
// 다른 리소스와 통일해 달라고 백엔드에 요청해 둔 상태라, 통일되면 위 형태로 되돌린다.
const atRoot = () => ({ baseURL: API_ROOT, params: { userId: currentUserId() } });

export const activitiesApi = {
	listKey: 'activities',
	list: () => apiClient.get('/activities/me', atRoot()).then((r) => r.data),
	listItems: () =>
		apiClient.get('/activities/me', atRoot()).then((r) => listOf(r.data, 'activities')),
	create: (payload) => apiClient.post('/activities', payload, atRoot()).then((r) => r.data),
	update: (id, payload) =>
		apiClient.put(`/activities/${id}`, payload, atRoot()).then((r) => r.data),
	remove: (id) => apiClient.delete(`/activities/${id}`, atRoot()).then((r) => r.data),
};

export const techStacksApi = {
	...createRecordApi('tech-stacks', 'techStacks'),
	// 표·상세 페이지 헤더 표기가 엇갈려 백엔드(강지호)에게 직접 문의 — PUT이 맞다.
	reorder: (skillIds) => apiClient.put('/tech-stacks/reorder', { skillIds }).then((r) => r.data),
};

/** 마이페이지 카드가 쓰는 분류 키 → API 매핑 */
export const RECORD_APIS = {
	contests: contestsApi,
	careers: careersApi,
	certificates: certificatesApi,
	education: educationApi,
	techStacks: techStacksApi,
	activities: activitiesApi,
};
