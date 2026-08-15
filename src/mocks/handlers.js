import { http, HttpResponse } from 'msw';
import { camelizeKeys } from '../api/normalize';

// 백엔드가 뜨기 전에도 화면을 돌려볼 수 있게 하는 목 데이터.
// 응답 형태는 Notion API 명세서의 각 엔드포인트 상세 페이지를 그대로 따른다.
//
// 예외: 채용공고 분석(/job-postings)과 결과물 생성(/generations) 계열은 명세서
// 본문이 아직 비어 있어, DB 명세서(job_postings / generations / generation_results
// 테이블)의 컬럼을 camelCase 로 옮긴 잠정 형태다. 백엔드 스키마가 확정되면
// 이 파일과 각 페이지의 응답 파싱부만 고치면 된다.
/**
 * 클라이언트는 실서버에 맞춰 요청 본문을 snake_case 로 보낸다(client.js 요청 인터셉터).
 * 목 핸들러는 camelCase 로 읽도록 쓰여 있으므로 들어올 때 되돌려 준다.
 */
const body = async (request) => camelizeKeys(await request.json());

const users = new Map();
let nextUserId = 1;
let nextIntegrationId = 1;
let nextJobPostingId = 1;
let nextGenerationId = 1;

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
	preferences: {
		keywords: [],
		emphasizedTypes: [],
		style: '',
	},
	integrations: [],
	projects: [],
	activities: [],
	contests: [],
	careers: [],
	certificates: [],
	education: [],
	techStacks: [],
	jobPostings: [],
	generations: [],
};

const fail = (status, error, message) => HttpResponse.json({ status, error, message }, { status });

// ── 활동 이력 계열 공통 CRUD ────────────────────────────
// 리소스마다 목록 키와 식별자 필드명이 달라서(activityId / contestId / skillId …)
// 표를 만들어 한 번에 처리한다. 이름·에러 코드도 명세서 문구를 그대로 쓴다.
const RECORD_SPECS = [
	{
		path: 'activities',
		listKey: 'activities',
		idField: 'activityId',
		label: '활동 이력',
		errorCode: 'ACTIVITY_NOT_FOUND',
		requiredField: 'name',
		requiredMessage: '활동명은 필수 입력값입니다.',
	},
	{
		path: 'contests',
		listKey: 'contests',
		idField: 'contestId',
		label: '공모전',
		errorCode: 'CONTEST_NOT_FOUND',
		requiredField: 'name',
		requiredMessage: '공모전명은 필수 입력값입니다.',
	},
	{
		path: 'careers',
		listKey: 'careers',
		idField: 'careerId',
		label: '경력',
		errorCode: 'CAREER_NOT_FOUND',
		requiredField: 'companyName',
		requiredMessage: '회사명은 필수 입력값입니다.',
	},
	{
		path: 'certificates',
		listKey: 'certificates',
		idField: 'certificateId',
		label: '자격증',
		errorCode: 'CERTIFICATE_NOT_FOUND',
		requiredField: 'name',
		requiredMessage: '자격증명은 필수 입력값입니다.',
	},
	{
		path: 'education',
		listKey: 'education',
		idField: 'educationId',
		label: '교육 이력',
		errorCode: 'EDUCATION_NOT_FOUND',
		requiredField: 'school',
		requiredMessage: '학교명은 필수 입력값입니다.',
	},
	{
		path: 'tech-stacks',
		listKey: 'techStacks',
		idField: 'skillId',
		label: '기술스택',
		errorCode: 'TECH_STACK_NOT_FOUND',
		requiredField: 'name',
		requiredMessage: '기술명은 필수 입력값입니다.',
	},
];

const nextIds = {};
const nextIdFor = (path) => {
	nextIds[path] = (nextIds[path] ?? 0) + 1;
	return nextIds[path];
};

const recordHandlers = RECORD_SPECS.flatMap((spec) => {
	const collection = () => state[spec.listKey];

	// 활동이력만 실서버에서 /api 밖(루트)에 있고 목록도 /me 로 따로 논다.
	// 목 서버도 같은 모양이어야 화면 코드를 그대로 검증할 수 있다.
	if (spec.path === 'activities') {
		return [
			http.get('/activities/me', () => HttpResponse.json(collection())),
			http.post('/activities', async ({ request }) => {
				const payload = await body(request);
				if (!payload?.[spec.requiredField]?.trim?.()) {
					return fail(400, 'VALIDATION_ERROR', spec.requiredMessage);
				}
				const item = { [spec.idField]: nextIdFor(spec.path), ...payload };
				collection().push(item);
				return HttpResponse.json(
					{ [spec.idField]: item[spec.idField], message: `${spec.label}이(가) 등록되었습니다.` },
					{ status: 201 },
				);
			}),
			http.put('/activities/:id', async ({ params, request }) => {
				const item = collection().find((row) => row[spec.idField] === Number(params.id));
				if (!item) return fail(404, spec.errorCode, `해당 ${spec.label}을(를) 찾을 수 없습니다.`);
				Object.assign(item, await body(request));
				return HttpResponse.json({ message: `${spec.label}이(가) 수정되었습니다.`, ...item });
			}),
			http.delete('/activities/:id', ({ params }) => {
				const index = collection().findIndex((row) => row[spec.idField] === Number(params.id));
				if (index === -1) return fail(404, spec.errorCode, `해당 ${spec.label}을(를) 찾을 수 없습니다.`);
				collection().splice(index, 1);
				return HttpResponse.json({ message: `${spec.label}이(가) 삭제되었습니다.` });
			}),
		];
	}

	return [
		http.get(`/api/${spec.path}`, () => HttpResponse.json({ [spec.listKey]: collection() })),

		http.post(`/api/${spec.path}`, async ({ request }) => {
			const payload = await body(request);

			if (!payload?.[spec.requiredField]?.trim?.()) {
				return fail(400, 'VALIDATION_ERROR', spec.requiredMessage);
			}

			// 기술스택만 같은 이름을 두 번 넣을 수 없다(UNIQUE(user_id, name)).
			if (
				spec.path === 'tech-stacks' &&
				collection().some((item) => item.name === payload.name)
			) {
				return fail(400, 'DUPLICATE_TECH_STACK', '이미 등록된 기술입니다.');
			}

			const item = { [spec.idField]: nextIdFor(spec.path), ...payload };
			collection().push(item);

			return HttpResponse.json(
				{
					[spec.idField]: item[spec.idField],
					message: `${spec.label}이(가) 등록되었습니다.`,
				},
				{ status: 201 },
			);
		}),

		http.patch(`/api/${spec.path}/:id`, async ({ params, request }) => {
			const item = collection().find((row) => row[spec.idField] === Number(params.id));
			if (!item) {
				return fail(404, spec.errorCode, `해당 ${spec.label}을(를) 찾을 수 없습니다.`);
			}

			const patch = await body(request);
			Object.assign(item, patch);

			return HttpResponse.json({
				message: `${spec.label}이(가) 수정되었습니다.`,
				...item,
			});
		}),

		http.delete(`/api/${spec.path}/:id`, ({ params }) => {
			const index = collection().findIndex((row) => row[spec.idField] === Number(params.id));
			if (index === -1) {
				return fail(404, spec.errorCode, `해당 ${spec.label}을(를) 찾을 수 없습니다.`);
			}

			collection().splice(index, 1);
			return HttpResponse.json({ message: `${spec.label}이(가) 삭제되었습니다.` });
		}),
	];
});

// DB 명세서 generation_results.type ENUM 은 INTERVIEW_QUESTIONS 까지 5종이지만,
// 결과물이 '자기소개 사이트'라 면접 질문은 화면에서 빼 뒀다(src/constants/resultTypes.js).
// 목 서버도 만들지 않는 쪽으로 맞춘다.
const GENERATION_TYPES = ['SELF_INTRODUCTION', 'RESUME', 'PORTFOLIO', 'PROJECT_INTRO'];

const SAMPLE_CONTENT = {
	SELF_INTRODUCTION:
		'문제를 끝까지 파고드는 개발자입니다. GitHub·Velog에 남긴 기록을 보면 막힌 지점을 어떻게 풀어냈는지가 드러납니다.',
	RESUME: '- 스타트업 A 백엔드 인턴 (2026.01~2026.02)\n- 결제 실패율 3% → 0.5% 개선',
	PORTFOLIO:
		'AI 이력서 생성 서비스 / 팀 프로젝트 / 백엔드 개발\n인증 서버와 API 게이트웨이를 설계·구현했습니다.',
	PROJECT_INTRO:
		'본 프로젝트는 GitHub·Velog 연동을 통해 흩어진 기록을 한 곳으로 모으는 것에서 출발했습니다.',
};

// 생성 요청을 받으면 결과가 하나씩 완료되는 흐름을 흉내 낸다.
// 사용자가 직접 고친 항목(edited)은 재생성해도 덮어쓰지 않는다
// — DB 명세서 generation_results.edited 의 존재 이유가 이것이다.
const startGeneration = (generation) => {
	generation.results
		.filter((result) => !result.edited)
		.forEach((result, index) => {
			setTimeout(
				() => {
					result.status = 'COMPLETED';
					result.content = SAMPLE_CONTENT[result.type] ?? '';

					if (generation.results.every((row) => row.status !== 'IN_PROGRESS')) {
						generation.overallStatus = generation.results.some(
							(row) => row.status === 'FAILED',
						)
							? 'PARTIALLY_COMPLETED'
							: 'COMPLETED';
					}
				},
				(index + 1) * 900,
			);
		});
};

export const handlers = [
	// ── 인증 ────────────────────────────────────────────
	http.post('/api/auth/signup', async ({ request }) => {
		const { name, email, password, phone } = await body(request);

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
		const { email, password } = await body(request);
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
		const { refreshToken } = await body(request);
		if (refreshToken !== REFRESH_TOKEN) {
			return fail(401, 'EXPIRED_REFRESH_TOKEN', '리프레시 토큰이 만료되었습니다.');
		}
		return HttpResponse.json({ accessToken: ACCESS_TOKEN, expiresIn: 3600 });
	}),

	// ── 프로필 ──────────────────────────────────────────
	http.get('/api/profile', () => HttpResponse.json(state.profile)),

	http.patch('/api/profile', async ({ request }) => {
		const patch = await body(request);
		Object.assign(state.profile, patch);
		return HttpResponse.json({
			message: '프로필이 수정되었습니다.',
			introOneLiner: state.profile.introOneLiner,
			desiredJob: state.profile.desiredJob,
		});
	}),

	// ── 맞춤화 설정 ─────────────────────────────────────
	http.get('/api/preferences', () => HttpResponse.json(state.preferences)),

	http.patch('/api/preferences', async ({ request }) => {
		const patch = await body(request);

		// keywords 는 배열, style 은 문자열이어야 함.
		if (
			(patch.keywords !== undefined && !Array.isArray(patch.keywords)) ||
			(patch.style !== undefined && typeof patch.style !== 'string')
		) {
			return fail(400, 'INVALID_INPUT', '잘못된 입력값입니다.');
		}

		Object.assign(state.preferences, patch);
		return HttpResponse.json({
			message: '맞춤화 설정이 수정되었습니다.',
			keywords: state.preferences.keywords,
			style: state.preferences.style,
		});
	}),

	// ── 외부 연동 ───────────────────────────────────────
	http.get('/api/integrations', () => HttpResponse.json({ integrations: state.integrations })),

	http.post('/api/integrations', async ({ request }) => {
		const { platform, value } = await body(request);

		if (state.integrations.some((item) => item.value === value)) {
			return fail(409, 'INTEGRATION_ALREADY_EXISTS', '이미 등록된 플랫폼입니다.');
		}

		const integration = {
			integrationId: nextIntegrationId++,
			platform,
			value,
			status: 'PENDING',
			lastSyncedAt: null,
		};
		state.integrations.push(integration);

		// 수집이 끝나는 흐름을 흉내 낸다.
		setTimeout(() => {
			integration.status = 'COMPLETED';
			integration.lastSyncedAt = new Date().toISOString();
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

	http.post('/api/integrations/:integrationId/sync', ({ params }) => {
		const integration = state.integrations.find(
			(item) => item.integrationId === Number(params.integrationId),
		);
		if (!integration) {
			return fail(404, 'INTEGRATION_NOT_FOUND', '해당 연동 정보를 찾을 수 없습니다.');
		}

		integration.status = 'IN_PROGRESS';
		setTimeout(() => {
			integration.status = 'COMPLETED';
			integration.lastSyncedAt = new Date().toISOString();
		}, 2500);

		return HttpResponse.json({
			integrationId: integration.integrationId,
			status: 'IN_PROGRESS',
			message: '재수집이 시작되었습니다.',
		});
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
			lastSyncedAt: integration.lastSyncedAt,
			repoCount: 12,
			extractedSkills: ['React', 'Emotion', 'Vite'],
		});
	}),

	// ── 프로젝트 ────────────────────────────────────────
	// 목록 조회는 명세서 예시상 5개 필드만 내려온다(githubUrl 등 무거운 필드는 상세 조회 전용).
	http.get('/api/projects', () =>
		HttpResponse.json({
			projects: state.projects.map(({ projectId, name, startDate, endDate, role }) => ({
				projectId,
				name,
				startDate,
				endDate,
				role,
			})),
		}),
	),

	http.get('/api/projects/:projectId', ({ params }) => {
		const project = state.projects.find((item) => item.projectId === Number(params.projectId));
		if (!project) {
			return fail(404, 'PROJECT_NOT_FOUND', '해당 프로젝트를 찾을 수 없습니다.');
		}
		return HttpResponse.json(project);
	}),

	http.post('/api/projects', async ({ request }) => {
		const payload = await body(request);

		if (!payload?.name?.trim()) {
			return fail(400, 'VALIDATION_ERROR', '프로젝트명은 필수 입력값입니다.');
		}
		if (payload.startDate && payload.endDate && payload.startDate > payload.endDate) {
			return fail(400, 'VALIDATION_ERROR', '시작일은 종료일보다 늦을 수 없습니다.');
		}

		const project = {
			projectId: nextIdFor('projects'),
			teamType: 'PERSONAL',
			description: '',
			attachments: [],
			...payload,
		};
		state.projects.push(project);

		return HttpResponse.json(
			{ projectId: project.projectId, message: '프로젝트가 등록되었습니다.' },
			{ status: 201 },
		);
	}),

	http.patch('/api/projects/:projectId', async ({ params, request }) => {
		const project = state.projects.find((item) => item.projectId === Number(params.projectId));
		if (!project) {
			return fail(404, 'PROJECT_NOT_FOUND', '해당 프로젝트를 찾을 수 없습니다.');
		}

		Object.assign(project, await body(request));
		return HttpResponse.json({ message: '프로젝트가 수정되었습니다.', ...project });
	}),

	http.delete('/api/projects/:projectId', ({ params }) => {
		const index = state.projects.findIndex(
			(item) => item.projectId === Number(params.projectId),
		);
		if (index === -1) {
			return fail(404, 'PROJECT_NOT_FOUND', '해당 프로젝트를 찾을 수 없습니다.');
		}

		state.projects.splice(index, 1);
		return HttpResponse.json({ message: '프로젝트가 삭제되었습니다.' });
	}),

	http.post('/api/projects/:projectId/attachments', async ({ params, request }) => {
		const project = state.projects.find((item) => item.projectId === Number(params.projectId));
		if (!project) {
			return fail(404, 'PROJECT_NOT_FOUND', '해당 프로젝트를 찾을 수 없습니다.');
		}

		const formData = await request.formData();
		const file = formData.get('file');

		if (file && file.size > 10 * 1024 * 1024) {
			return fail(413, 'FILE_TOO_LARGE', '파일 용량은 10MB를 초과할 수 없습니다.');
		}

		const attachment = {
			attachmentId: nextIdFor('attachments'),
			fileUrl: `https://mock.portai/${file?.name ?? 'presentation.pdf'}`,
		};
		project.attachments.push(attachment);

		return HttpResponse.json({ ...attachment, message: '파일이 업로드되었습니다.' });
	}),

	http.post('/api/projects/:projectId/description/generate', async ({ params }) => {
		const project = state.projects.find((item) => item.projectId === Number(params.projectId));
		if (!project) {
			return fail(404, 'PROJECT_NOT_FOUND', '해당 프로젝트를 찾을 수 없습니다.');
		}

		project.description = `본 프로젝트(${project.name})는 GitHub·Velog 연동을 통해 흩어진 기록을 한 곳으로 모으는 것에서 출발했습니다.`;
		return HttpResponse.json({ generatedDescription: project.description });
	}),

	// ── 활동이력·공모전·경력·자격증·교육·기술스택 CRUD ──
	...recordHandlers,

	// 재정렬은 목록 순서를 skillIds 순으로 바꾼다. 명세서상 응답 본문은 없다.
	http.put('/api/tech-stacks/reorder', async ({ request }) => {
		const { skillIds } = await body(request);

		if (!Array.isArray(skillIds)) {
			return fail(400, 'INVALID_INPUT', '잘못된 입력값입니다.');
		}
		if (skillIds.some((id) => !state.techStacks.some((item) => item.skillId === id))) {
			return fail(
				404,
				'TECH_STACK_NOT_FOUND',
				'해당 기술 스택을 찾을 수 없거나 권한이 없습니다.',
			);
		}

		state.techStacks.sort((a, b) => skillIds.indexOf(a.skillId) - skillIds.indexOf(b.skillId));
		return new HttpResponse(null, { status: 204 });
	}),

	// ── 채용공고 분석 (명세서 본문이 비어 있어 형태는 잠정) ──
	// 분석 이력 목록 조회·삭제는 아직 화면이 없어 만들지 않았다.
	// 만들 때는 Notion API 명세서에 실제 응답 예시가 채워졌는지부터 확인할 것.
	http.get('/api/job-postings/:jobPostingId', ({ params }) => {
		const posting = state.jobPostings.find(
			(item) => item.jobPostingId === Number(params.jobPostingId),
		);
		if (!posting) {
			return fail(404, 'JOB_POSTING_NOT_FOUND', '해당 분석 이력을 찾을 수 없습니다.');
		}
		return HttpResponse.json(posting);
	}),

	http.post('/api/job-postings/url', async ({ request }) => {
		const { url } = await body(request);

		if (!url?.trim()) {
			return fail(400, 'INVALID_INPUT', '채용공고 URL은 필수 입력값입니다.');
		}

		const posting = createJobPosting('URL', url);
		return HttpResponse.json(
			{
				jobPostingId: posting.jobPostingId,
				sourceType: 'URL',
				status: 'PENDING',
				message: '채용공고 분석이 접수되었습니다.',
			},
			{ status: 202 },
		);
	}),

	http.post('/api/job-postings/pdf', async ({ request }) => {
		const formData = await request.formData();
		const file = formData.get('file');

		if (!file) {
			return fail(400, 'INVALID_INPUT', '분석할 파일이 필요합니다.');
		}

		const posting = createJobPosting('PDF', file.name);
		return HttpResponse.json(
			{
				jobPostingId: posting.jobPostingId,
				sourceType: 'PDF',
				status: 'PENDING',
				message: '채용공고 분석이 접수되었습니다.',
			},
			{ status: 202 },
		);
	}),

	// ── 결과물 생성 (명세서 본문이 비어 있어 형태는 잠정) ──
	http.get('/api/generations', () =>
		HttpResponse.json({
			generations: state.generations.map(({ results, ...rest }) => ({
				...rest,
				resultCount: results.length,
			})),
		}),
	),

	http.get('/api/generations/:generationId', ({ params }) => {
		const generation = state.generations.find(
			(item) => item.generationId === Number(params.generationId),
		);
		if (!generation) {
			return fail(404, 'GENERATION_NOT_FOUND', '해당 생성 이력을 찾을 수 없습니다.');
		}
		return HttpResponse.json(generation);
	}),

	http.post('/api/generations', async ({ request }) => {
		const payload = await body(request);

		const generation = {
			generationId: nextGenerationId++,
			jobPostingId: payload?.jobPostingId ?? null,
			style: payload?.style ?? 'CONCISE',
			title: payload?.title ?? '내 포트폴리오',
			overallStatus: 'IN_PROGRESS',
			createdAt: new Date().toISOString(),
			results: GENERATION_TYPES.map((type) => ({
				type,
				status: 'IN_PROGRESS',
				content: '',
				fileUrl: null,
				edited: false,
			})),
		};
		state.generations.push(generation);
		startGeneration(generation);

		return HttpResponse.json(
			{
				generationId: generation.generationId,
				overallStatus: 'IN_PROGRESS',
				message: '결과물 생성이 시작되었습니다.',
			},
			{ status: 202 },
		);
	}),

	http.post('/api/generations/:generationId/regenerate', ({ params }) => {
		const generation = state.generations.find(
			(item) => item.generationId === Number(params.generationId),
		);
		if (!generation) {
			return fail(404, 'GENERATION_NOT_FOUND', '해당 생성 이력을 찾을 수 없습니다.');
		}

		// 사용자가 직접 고친 항목은 덮어쓰지 않는다(generation_results.edited).
		generation.overallStatus = 'IN_PROGRESS';
		generation.results.forEach((result) => {
			if (!result.edited) result.status = 'IN_PROGRESS';
		});
		startGeneration(generation);

		return HttpResponse.json({
			generationId: generation.generationId,
			overallStatus: 'IN_PROGRESS',
			message: '재생성이 시작되었습니다.',
		});
	}),

	http.patch('/api/generations/:generationId/results/:type', async ({ params, request }) => {
		const generation = state.generations.find(
			(item) => item.generationId === Number(params.generationId),
		);
		const result = generation?.results.find((row) => row.type === params.type);

		if (!result) {
			return fail(404, 'GENERATION_RESULT_NOT_FOUND', '해당 결과물을 찾을 수 없습니다.');
		}

		const { content } = await body(request);
		result.content = content ?? '';
		result.edited = true;

		return HttpResponse.json({
			message: '결과물이 수정되었습니다.',
			type: result.type,
			content: result.content,
			edited: true,
		});
	}),

	// 다운로드는 결과물 종류별로 나뉜다.
	http.get('/api/generations/:generationId/results/:type/download', ({ params }) => {
		const generation = state.generations.find(
			(item) => item.generationId === Number(params.generationId),
		);
		if (!generation) {
			return fail(404, 'GENERATION_NOT_FOUND', '해당 생성 이력을 찾을 수 없습니다.');
		}

		const body = generation.results
			.filter((result) => result.type === params.type)
			.map((result) => `## ${result.type}\n${result.content}`)
			.join('\n\n');

		return new HttpResponse(body, {
			headers: {
				'Content-Type': 'application/pdf',
				'Content-Disposition': `attachment; filename="portai-${generation.generationId}.pdf"`,
			},
		});
	}),
];

// 분석이 PENDING → COMPLETED 로 넘어가는 흐름을 흉내 낸다.
function createJobPosting(sourceType, sourceValue) {
	const posting = {
		jobPostingId: nextJobPostingId++,
		sourceType,
		sourceValue,
		status: 'PENDING',
		requiredSkills: [],
		preferredSkills: [],
		matchScore: null,
		failReason: null,
		createdAt: new Date().toISOString(),
	};
	state.jobPostings.push(posting);

	setTimeout(() => {
		posting.status = 'COMPLETED';
		posting.requiredSkills = ['React', 'TypeScript', 'REST API'];
		posting.preferredSkills = ['Next.js', '테스트 코드 작성'];
		posting.matchScore = 0.82;
	}, 2000);

	return posting;
}
