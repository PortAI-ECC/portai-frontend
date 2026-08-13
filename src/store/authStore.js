import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// 명세서상 로그인 응답이 refreshToken 을 본문으로 내려주고, 갱신·로그아웃 때
// 그 값을 다시 body 로 보내야 한다. 그래서 클라이언트가 직접 보관한다.
export const useAuthStore = create(
	persist(
		(set) => ({
			accessToken: null,
			refreshToken: null,
			user: null,

			signIn: ({ accessToken, refreshToken, user }) =>
				set({ accessToken, refreshToken, user }),
			setAccessToken: (accessToken) => set({ accessToken }),
			signOut: () => set({ accessToken: null, refreshToken: null, user: null }),
		}),
		{ name: 'portai-auth' },
	),
);

export const selectIsLoggedIn = (state) => Boolean(state.accessToken);
