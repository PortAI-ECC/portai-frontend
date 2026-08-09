import { apiClient } from './client';

// 공모전·인턴/경력·자격증·교육·활동이력은 모두 동일한 CRUD 형태라 하나로 묶는다.
// 목록 응답은 리소스마다 다른 키로 감싸여 온다: { activities: [...] }, { contests: [...] } 등.
const createRecordApi = (resource, listKey) => ({
	listKey,
	list: (params) => apiClient.get(`/${resource}`, { params }).then((r) => r.data),
	listItems: (params) =>
		apiClient.get(`/${resource}`, { params }).then((r) => r.data?.[listKey] ?? []),
	create: (payload) => apiClient.post(`/${resource}`, payload).then((r) => r.data),
	update: (id, payload) => apiClient.patch(`/${resource}/${id}`, payload).then((r) => r.data),
	remove: (id) => apiClient.delete(`/${resource}/${id}`).then((r) => r.data),
});

export const contestsApi = createRecordApi('contests', 'contests');
export const careersApi = createRecordApi('careers', 'careers');
export const certificatesApi = createRecordApi('certificates', 'certificates');
export const educationApi = createRecordApi('education', 'education');
export const activitiesApi = createRecordApi('activities', 'activities');

export const techStacksApi = {
	...createRecordApi('tech-stacks', 'techStacks'),
	// 표에는 PUT 으로 적혀 있지만 상세 페이지 헤더는 POST 다. 상세 쪽을 따른다.
	reorder: (skillIds) => apiClient.post('/tech-stacks/reorder', { skillIds }).then((r) => r.data),
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
