import { apiClient } from './client';

export const signUp = (payload) => apiClient.post('/auth/signup', payload).then((r) => r.data);
export const logIn = (payload) => apiClient.post('/auth/login', payload).then((r) => r.data);
export const logOut = () => apiClient.post('/auth/logout').then((r) => r.data);
export const refresh = () => apiClient.post('/auth/refresh').then((r) => r.data);
