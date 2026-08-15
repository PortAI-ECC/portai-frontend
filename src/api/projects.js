import { apiClient, currentUserId } from './client';
import { listOf } from './normalize';

export const getProjects = (params) => apiClient.get('/projects', { params }).then((r) => r.data);
export const getProject = (projectId) =>
	apiClient.get(`/projects/${projectId}`).then((r) => r.data);
export const createProject = (payload) => apiClient.post('/projects', payload).then((r) => r.data);
// 프로젝트만 수정이 PATCH 가 아니라 PUT 이다(활동이력과 같음).
export const updateProject = (projectId, payload) =>
	apiClient.put(`/projects/${projectId}`, payload).then((r) => r.data);
export const deleteProject = (projectId) =>
	apiClient.delete(`/projects/${projectId}`).then((r) => r.data);

// userId 는 쿼리가 아니라 폼 필드로 받는다(채용공고 PDF 업로드와 같음).
export const uploadAttachment = (projectId, file) => {
	const formData = new FormData();
	formData.append('file', file);

	const userId = currentUserId();
	if (userId !== undefined && userId !== null) formData.append('userId', userId);

	return apiClient.post(`/projects/${projectId}/attachments`, formData).then((r) => r.data);
};

export const generateDescription = (projectId, tone) =>
	apiClient
		.post(`/projects/${projectId}/description/generate`, tone ? { tone } : undefined)
		.then((r) => r.data);

// 활동이력 관리 모달이 쓰는 인터페이스에 맞춘 어댑터.
// 프로젝트는 첨부·AI 설명이 더 있을 뿐 목록/등록/수정/삭제 모양은 같다.
export const projectsApi = {
	listKey: 'projects',
	list: getProjects,
	listItems: (params) => getProjects(params).then((data) => listOf(data, 'projects')),
	create: createProject,
	update: updateProject,
	remove: deleteProject,
};
