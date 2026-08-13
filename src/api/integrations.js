import { apiClient } from './client';
import { listOf } from './normalize';

// 목록은 { success, data: [...] } 봉투로 온다(인터셉터가 벗겨 배열만 남는다).
export const getIntegrations = () =>
	apiClient.get('/integrations').then((r) => listOf(r.data, 'integrations'));
export const createIntegration = (payload) =>
	apiClient.post('/integrations', payload).then((r) => r.data);
export const deleteIntegration = (integrationId) =>
	apiClient.delete(`/integrations/${integrationId}`).then((r) => r.data);
export const syncIntegration = (integrationId) =>
	apiClient.post(`/integrations/${integrationId}/sync`).then((r) => r.data);
export const getSyncStatus = (integrationId) =>
	apiClient.get(`/integrations/${integrationId}/sync-status`).then((r) => r.data);
