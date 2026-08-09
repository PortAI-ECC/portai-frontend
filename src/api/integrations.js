import { apiClient } from './client';

export const getIntegrations = () => apiClient.get('/integrations').then((r) => r.data);
export const createIntegration = (payload) =>
	apiClient.post('/integrations', payload).then((r) => r.data);
export const deleteIntegration = (integrationId) =>
	apiClient.delete(`/integrations/${integrationId}`).then((r) => r.data);
export const syncIntegration = (integrationId) =>
	apiClient.post(`/integrations/${integrationId}/sync`).then((r) => r.data);
export const getSyncStatus = (integrationId) =>
	apiClient.get(`/integrations/${integrationId}/sync-status`).then((r) => r.data);
