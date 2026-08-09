import { apiClient } from './client';

export const getProfile = () => apiClient.get('/profile').then((r) => r.data);
export const updateProfile = (payload) => apiClient.patch('/profile', payload).then((r) => r.data);

export const getPreferences = () => apiClient.get('/preferences').then((r) => r.data);
export const updatePreferences = (payload) =>
	apiClient.patch('/preferences', payload).then((r) => r.data);
