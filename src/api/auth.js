import { apiClient } from './client';

/** @param payload { name, email, password, phone } */
export const signUp = (payload) => apiClient.post('/auth/signup', payload).then((r) => r.data);

/** @returns { message, accessToken, refreshToken, expiresIn, user } */
export const logIn = (payload) => apiClient.post('/auth/login', payload).then((r) => r.data);

export const logOut = (refreshToken) =>
	apiClient.post('/auth/logout', { refreshToken }).then((r) => r.data);

export const refresh = (refreshToken) =>
	apiClient.post('/auth/refresh', { refreshToken }).then((r) => r.data);
