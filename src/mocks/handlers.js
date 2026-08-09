import { http, HttpResponse } from 'msw';

// 백엔드가 뜨기 전에도 화면을 돌려볼 수 있게 하는 목 데이터.
// 응답 형태는 Notion API 명세서의 각 엔드포인트 상세 페이지를 그대로 따른다.
const users = new Map();
let nextUserId = 1;
let nextIntegrationId = 1;

const ACCESS_TOKEN = 'mock-access-token';
const REFRESH_TOKEN = 'mock-refresh-token';

const state = {
	profile: {
		userId: 1,
		name: '',
		email: '',
		phone: '',
		introOneLiner: '',
		desiredJob: '',
		desiredCompany: '',
	},
	integrations: [],
	activities: [],
	contests: [],
	careers: [],
	certificates: [],
	education: [],
	techStacks: [],
};

const fail = (status, error, message) => HttpResponse.json({ status, error, message }, { status });

export const handlers = [
	// ── 인증 ────────────────────────────────────────────
	http.post('/api/auth/signup', async ({ request }) => {
		const { name, email, password, phone } = await request.json();

		if (users.has(email)) {
			return fail(409, 'EMAIL_ALREADY_EXISTS', '이미 가입된 이메일입니다.');
		}

		const userId = nextUserId++;
		users.set(email, { userId, name, email, password, phone });
		return HttpResponse.json(
			{ userId, message: '회원가입 성공', name, email },
			{ status: 201 },
		);
	}),

	http.post('/api/auth/login', async ({ request }) => {
		const { email, password } = await request.json();
		const user = users.get(email);

		if (!user || user.password !== password) {
			return fail(401, 'INVALID_CREDENTIALS', '이메일 또는 비밀번호가 일치하지 않습니다.');
		}

		Object.assign(state.profile, {
			userId: user.userId,
			name: user.name,
			email: user.email,
			phone: user.phone,
		});

		return HttpResponse.json({
			message: '로그인 성공',
			accessToken: ACCESS_TOKEN,
			refreshToken: REFRESH_TOKEN,
			expiresIn: 3600,
			user: { userId: user.userId, name: user.name, email: user.email },
		});
	}),

	http.post('/api/auth/logout', () => HttpResponse.json({ message: '로그아웃 되었습니다.' })),

	http.post('/api/auth/refresh', async ({ request }) => {
		const { refreshToken } = await request.json();
		if (refreshToken !== REFRESH_TOKEN) {
			return fail(401, 'EXPIRED_REFRESH_TOKEN', '리프레시 토큰이 만료되었습니다.');
		}
		return HttpResponse.json({ accessToken: ACCESS_TOKEN, expiresIn: 3600 });
	}),

	// ── 프로필 ──────────────────────────────────────────
	http.get('/api/profile', () => HttpResponse.json(state.profile)),

	http.patch('/api/profile', async ({ request }) => {
		const patch = await request.json();
		Object.assign(state.profile, patch);
		return HttpResponse.json({
			message: '프로필이 수정되었습니다.',
			introOneLiner: state.profile.introOneLiner,
			desiredJob: state.profile.desiredJob,
		});
	}),

	// ── 외부 연동 ───────────────────────────────────────
	http.get('/api/integrations', () => HttpResponse.json({ integrations: state.integrations })),

	http.post('/api/integrations', async ({ request }) => {
		const { platform, value } = await request.json();

		if (state.integrations.some((item) => item.value === value)) {
			return fail(409, 'INTEGRATION_ALREADY_EXISTS', '이미 등록된 플랫폼입니다.');
		}

		const integration = {
			integrationId: nextIntegrationId++,
			platform,
			value,
			status: 'PENDING',
		};
		state.integrations.push(integration);

		// 수집이 끝나는 흐름을 흉내 낸다.
		setTimeout(() => {
			integration.status = 'COMPLETED';
		}, 2000);

		return HttpResponse.json({
			integrationId: integration.integrationId,
			platform,
			status: 'PENDING',
			message: '연동 등록이 접수되었습니다. 정보를 수집하고 있습니다.',
		});
	}),

	http.delete('/api/integrations/:integrationId', ({ params }) => {
		const id = Number(params.integrationId);
		const index = state.integrations.findIndex((item) => item.integrationId === id);

		if (index === -1) {
			return fail(404, 'INTEGRATION_NOT_FOUND', '해당 연동 정보를 찾을 수 없습니다.');
		}

		state.integrations.splice(index, 1);
		return HttpResponse.json({ message: '연동이 해제되었습니다.' });
	}),

	http.get('/api/integrations/:integrationId/sync-status', ({ params }) => {
		const integration = state.integrations.find(
			(item) => item.integrationId === Number(params.integrationId),
		);
		if (!integration) {
			return fail(404, 'INTEGRATION_NOT_FOUND', '해당 연동 정보를 찾을 수 없습니다.');
		}
		return HttpResponse.json({
			status: integration.status,
			lastSyncedAt: new Date().toISOString(),
			repoCount: 12,
			extractedSkills: ['React', 'Emotion', 'Vite'],
		});
	}),

	// ── 활동 이력 계열 (목록 응답 키가 리소스마다 다르다) ──
	http.get('/api/activities', () => HttpResponse.json({ activities: state.activities })),
	http.get('/api/contests', () => HttpResponse.json({ contests: state.contests })),
	http.get('/api/careers', () => HttpResponse.json({ careers: state.careers })),
	http.get('/api/certificates', () => HttpResponse.json({ certificates: state.certificates })),
	http.get('/api/education', () => HttpResponse.json({ education: state.education })),
	http.get('/api/tech-stacks', () => HttpResponse.json({ techStacks: state.techStacks })),

	// ── 결과물 생성 (명세서 본문이 아직 비어 있어 형태는 잠정) ──
	http.get('/api/generations', () => HttpResponse.json({ generations: [] })),
];
