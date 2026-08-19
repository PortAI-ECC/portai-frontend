export const ROUTES = {
	HOME: '/',
	LOGIN: '/login',
	SIGNUP: '/signup',
	MYPAGE: '/mypage',
	CREATE_BASIC: '/create/basic',
	CREATE_LINKS: '/create/links',
	CREATE_TEXT: '/create/text',
	CREATE_JOB: '/create/job',
	CREATE_DRAFT: '/create/draft',
	CREATE_PREVIEW: '/create/preview',
	CREATE_DONE: '/create/done',
	// slug 는 경로가 아니라 해시(#)로 실린다 — PortfolioPage 참고.
	PORTFOLIO: '/u',
};

// 와이어프레임 상단 진행바. path 가 없는 단계는 결과 화면 묶음을 가리킨다.
export const CREATE_STEPS = [
	{ label: '기본 정보 입력', path: ROUTES.CREATE_BASIC },
	{ label: 'URL 입력', path: ROUTES.CREATE_LINKS },
	{ label: '자유 텍스트 입력', path: ROUTES.CREATE_TEXT },
	{ label: '채용 공고 입력', path: ROUTES.CREATE_JOB },
	{ label: '결과', path: ROUTES.CREATE_DRAFT },
];
