import { apiClient } from './client';

// 공모전·인턴/경력·자격증·교육·활동이력은 모두 동일한 CRUD 형태라 하나로 묶는다.
const createRecordApi = (resource) => ({
	list: (params) => apiClient.get(`/${resource}`, { params }).then((r) => r.data),
	create: (payload) => apiClient.post(`/${resource}`, payload).then((r) => r.data),
	update: (id, payload) => apiClient.patch(`/${resource}/${id}`, payload).then((r) => r.data),
	remove: (id) => apiClient.delete(`/${resource}/${id}`).then((r) => r.data),
});

export const contestsApi = createRecordApi('contests');
export const careersApi = createRecordApi('careers');
export const certificatesApi = createRecordApi('certificates');
export const educationApi = createRecordApi('education');
export const activitiesApi = createRecordApi('activities');

export const techStacksApi = {
	...createRecordApi('tech-stacks'),
	reorder: (payload) => apiClient.put('/tech-stacks/reorder', payload).then((r) => r.data),
};
