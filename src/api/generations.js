import { apiClient } from './client';

export const getGenerations = () => apiClient.get('/generations').then((r) => r.data);
export const getGeneration = (generationId) =>
	apiClient.get(`/generations/${generationId}`).then((r) => r.data);
export const createGeneration = (payload) =>
	apiClient.post('/generations', payload).then((r) => r.data);
export const regenerate = (generationId) =>
	apiClient.post(`/generations/${generationId}/regenerate`).then((r) => r.data);
export const updateResult = (generationId, type, payload) =>
	apiClient.patch(`/generations/${generationId}/results/${type}`, payload).then((r) => r.data);

export const downloadFile = (generationId) =>
	apiClient
		.get(`/generations/${generationId}/download`, { responseType: 'blob' })
		.then((r) => r.data);
