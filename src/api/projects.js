import { apiClient } from './client';

export const getProjects = (params) => apiClient.get('/projects', { params }).then((r) => r.data);
export const getProject = (projectId) =>
	apiClient.get(`/projects/${projectId}`).then((r) => r.data);
export const createProject = (payload) => apiClient.post('/projects', payload).then((r) => r.data);
export const updateProject = (projectId, payload) =>
	apiClient.patch(`/projects/${projectId}`, payload).then((r) => r.data);
export const deleteProject = (projectId) =>
	apiClient.delete(`/projects/${projectId}`).then((r) => r.data);

export const uploadAttachment = (projectId, file) => {
	const formData = new FormData();
	formData.append('file', file);
	return apiClient.post(`/projects/${projectId}/attachments`, formData).then((r) => r.data);
};

export const generateDescription = (projectId) =>
	apiClient.post(`/projects/${projectId}/description/generate`).then((r) => r.data);
