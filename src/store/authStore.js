import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// accessToken 은 메모리에만 두고 refreshToken 은 httpOnly 쿠키로 받는 것이 안전하지만,
// 백엔드 쿠키 설정 전까지는 새로고침 유지를 위해 localStorage 에 보관한다.
export const useAuthStore = create(
	persist(
		(set) => ({
			accessToken: null,
			user: null,

			signIn: ({ accessToken, user }) => set({ accessToken, user }),
			setAccessToken: (accessToken) => set({ accessToken }),
			signOut: () => set({ accessToken: null, user: null }),
		}),
		{ name: 'portai-auth' },
	),
);

export const selectIsLoggedIn = (state) => Boolean(state.accessToken);
