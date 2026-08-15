import { apiClient } from './client';

/** @returns { userId, name, email, phone, introOneLiner, desiredJob, desiredCompany } */
export const getProfile = () => apiClient.get('/profile').then((r) => r.data);

/** 수정 가능한 필드는 phone / introOneLiner / desiredJob / desiredCompany 넷이다. */
export const updateProfile = (payload) => apiClient.patch('/profile', payload).then((r) => r.data);

/** @returns { keywords: string[], emphasizedTypes: string[], style } */
export const getPreferences = () => apiClient.get('/preferences').then((r) => r.data);

/** payload: { keywords: string[], style } → { message, keywords, style } */
export const updatePreferences = (payload) =>
	apiClient.patch('/preferences', payload).then((r) => r.data);
