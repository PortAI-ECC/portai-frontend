import { http, HttpResponse } from 'msw';

// 백엔드가 뜨기 전에도 화면을 돌려볼 수 있게 하는 최소 목 데이터.
// 실제 응답 형태가 확정되면 API 명세서에 맞춰 여기부터 고치면 된다.
const users = new Map();

const accessToken = 'mock-access-token';

export const handlers = [
	http.post('/api/auth/signup', async ({ request }) => {
		const { email, password } = await request.json();

		if (users.has(email)) {
			return HttpResponse.json({ message: '이미 가입된 이메일입니다.' }, { status: 409 });
		}

		users.set(email, { email, password });
		return HttpResponse.json({ email }, { status: 201 });
	}),

	http.post('/api/auth/login', async ({ request }) => {
		const { email, password } = await request.json();
		const user = users.get(email);

		if (!user || user.password !== password) {
			return HttpResponse.json(
				{ message: '이메일 또는 비밀번호가 올바르지 않습니다.' },
				{ status: 401 },
			);
		}

		return HttpResponse.json({ accessToken, user: { email } });
	}),

	http.post('/api/auth/logout', () => new HttpResponse(null, { status: 204 })),
	http.post('/api/auth/refresh', () => HttpResponse.json({ accessToken })),

	http.get('/api/profile', () =>
		HttpResponse.json({ name: '', major: '', desiredRole: '', email: '', phone: '' }),
	),

	http.get('/api/generations', () => HttpResponse.json({ items: [] })),
];
