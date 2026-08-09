import { apiClient } from './client';

/** @returns { userId, name, email, phone, introOneLiner, desiredJob, desiredCompany } */
export const getProfile = () => apiClient.get('/profile').then((r) => r.data);

/** 명세서상 수정 가능한 필드는 introOneLiner / desiredJob 뿐이다. */
export const updateProfile = (payload) => apiClient.patch('/profile', payload).then((r) => r.data);

export const getPreferences = () => apiClient.get('/preferences').then((r) => r.data);
export const updatePreferences = (payload) =>
	apiClient.patch('/preferences', payload).then((r) => r.data);
