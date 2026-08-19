// 분류별 입력 폼 정의. 필드명은 API 명세서의 요청 본문 키를 그대로 쓰고,
// select 의 값은 DB 명세서(CREATE TABLE)의 ENUM 을 따른다.
//
// 주의: 기술스택 category/proficiency 는 API 명세서 예시(BACKEND / DESIGN / EXPERT)와
// DB 명세서 ENUM(LANGUAGE·FRAMEWORK·… / BEGINNER·INTERMEDIATE·ADVANCED)이 서로 다르다.
// 여기서는 CREATE TABLE 쪽을 따랐고, 백엔드 확인 후 한쪽으로 맞춰야 한다.

const DEGREE_OPTIONS = [
	{ value: 'ASSOCIATE', label: '전문학사' },
	{ value: 'BACHELOR', label: '학사' },
	{ value: 'MASTER', label: '석사' },
	{ value: 'DOCTORATE', label: '박사' },
];

const EDUCATION_STATUS_OPTIONS = [
	{ value: 'ENROLLED', label: '재학' },
	{ value: 'ON_LEAVE', label: '휴학' },
	{ value: 'GRADUATED', label: '졸업' },
	{ value: 'EXPECTED_GRADUATION', label: '졸업 예정' },
];

const TECH_CATEGORY_OPTIONS = [
	{ value: 'LANGUAGE', label: '언어' },
	{ value: 'FRAMEWORK', label: '프레임워크' },
	{ value: 'DATABASE', label: '데이터베이스' },
	{ value: 'CLOUD', label: '클라우드' },
	{ value: 'TOOL', label: '도구' },
	{ value: 'OTHER', label: '기타' },
];

const PROFICIENCY_OPTIONS = [
	{ value: 'BEGINNER', label: '초급' },
	{ value: 'INTERMEDIATE', label: '중급' },
	{ value: 'ADVANCED', label: '고급' },
];

const TEAM_TYPE_OPTIONS = [
	{ value: 'PERSONAL', label: '개인' },
	{ value: 'TEAM', label: '팀' },
];

const labelMapOf = (options) =>
	Object.fromEntries(options.map(({ value, label }) => [value, label]));

/** ENUM 값 → 한글 라벨. 옵션 배열과 다른 곳에서 문구가 갈라지지 않도록 여기서 파생한다. */
export const DEGREE_LABEL = labelMapOf(DEGREE_OPTIONS);
export const EDUCATION_STATUS_LABEL = labelMapOf(EDUCATION_STATUS_OPTIONS);
export const TECH_CATEGORY_LABEL = labelMapOf(TECH_CATEGORY_OPTIONS);
export const TEAM_TYPE_LABEL = labelMapOf(TEAM_TYPE_OPTIONS);

export const RECORD_FIELDS = {
	projects: [
		// 서버 ProjectRequest 의 필수 키는 name 이 아니라 title 이다.
		{ name: 'title', label: '프로젝트명', required: true },
		{ name: 'startDate', label: '시작일', type: 'date' },
		{ name: 'endDate', label: '종료일', type: 'date' },
		{ name: 'teamType', label: '팀/개인', type: 'select', options: TEAM_TYPE_OPTIONS },
		{ name: 'role', label: '담당 역할' },
		{ name: 'githubUrl', label: 'GitHub 저장소', placeholder: 'https://github.com/...' },
		{ name: 'myContribution', label: '가장 기여한 부분', type: 'textarea' },
		{ name: 'proudestAchievement', label: '가장 자랑하고 싶은 성과', type: 'textarea' },
		{ name: 'description', label: '프로젝트 설명 (AI 생성 가능)', type: 'textarea' },
	],
	contests: [
		{ name: 'name', label: '공모전명', required: true },
		{ name: 'host', label: '주최 기관' },
		{ name: 'startDate', label: '시작일', type: 'date' },
		{ name: 'endDate', label: '종료일', type: 'date' },
		// 수상 여부가 '결과' 바로 오른쪽 칸에 오도록, 담당 역할은 한 줄을 다 쓴다.
		{ name: 'role', label: '담당 역할', wide: true },
		{ name: 'result', label: '결과', placeholder: '예: 대상 수상' },
		{ name: 'awarded', label: '수상 여부', type: 'checkbox' },
	],
	careers: [
		{ name: 'companyName', label: '회사명', required: true },
		{ name: 'position', label: '직무' },
		{ name: 'startDate', label: '시작일', type: 'date' },
		{ name: 'endDate', label: '종료일', type: 'date' },
		{ name: 'duties', label: '담당 업무', type: 'textarea' },
		{ name: 'achievements', label: '성과', type: 'textarea' },
	],
	certificates: [
		// '자격증명'은 '자격 증명(credential)'으로 읽혀서 이름을 풀어 쓴다.
		{ name: 'name', label: '자격증 이름', required: true },
		{ name: 'issuer', label: '발급기관' },
		{ name: 'acquiredDate', label: '취득일', type: 'date' },
		{ name: 'expiryDate', label: '만료일', type: 'date' },
		{ name: 'score', label: '점수/등급', placeholder: '예: TOEIC 950' },
	],
	education: [
		{ name: 'school', label: '학교명', required: true },
		{ name: 'degree', label: '학위', type: 'select', options: DEGREE_OPTIONS },
		{ name: 'major', label: '전공' },
		{ name: 'doubleMajor', label: '복수/부전공' },
		{ name: 'gpaScore', label: '취득 학점', type: 'number', step: '0.01' },
		// 만점 기준은 4.5 / 4.3 처럼 소수 첫째 자리까지만 쓰므로 화살표도 0.1 씩 움직인다.
		{ name: 'gpaScale', label: '만점 기준', type: 'number', step: '0.1' },
		{ name: 'status', label: '재학 상태', type: 'select', options: EDUCATION_STATUS_OPTIONS },
		{ name: 'expectedGraduation', label: '졸업(예정)일', type: 'date' },
	],
	techStacks: [
		{ name: 'name', label: '기술명', required: true, placeholder: '예: React' },
		{ name: 'category', label: '분류', type: 'select', options: TECH_CATEGORY_OPTIONS },
		{ name: 'proficiency', label: '숙련도', type: 'select', options: PROFICIENCY_OPTIONS },
	],
	activities: [
		// 두 칸씩 배치되므로 시작일·종료일이 같은 줄에 나란히 오도록 순서를 잡는다.
		{ name: 'name', label: '활동명', required: true },
		{ name: 'role', label: '담당 역할' },
		{ name: 'startDate', label: '시작일', type: 'date' },
		{ name: 'endDate', label: '종료일', type: 'date' },
		{ name: 'description', label: '활동', type: 'textarea' },
	],
};

/**
 * 리소스마다 식별자 필드명이 다르다. 명세서가 아니라 실제 응답(2026-08-15 실측) 기준 —
 * 명세서와 달리 절반은 그냥 id 로 온다. 통일해 달라고 백엔드에 요청해 둔 상태다.
 */
export const RECORD_ID_FIELD = {
	projects: 'id',
	contests: 'contestId',
	careers: 'careerId',
	certificates: 'id',
	education: 'id',
	techStacks: 'skillId',
	activities: 'id',
};

/** 목록 한 줄에 크게 보여줄 대표 필드와 그 아래 보조 설명. */
export const RECORD_SUMMARY = {
	projects: {
		title: 'title',
		subtitle: (item) => [item.role, item.startDate].filter(Boolean).join(' · '),
	},
	contests: { title: 'name', subtitle: (item) => [item.host, item.result].filter(Boolean).join(' · ') },
	careers: {
		title: 'companyName',
		subtitle: (item) => [item.position, item.startDate].filter(Boolean).join(' · '),
	},
	certificates: {
		title: 'name',
		subtitle: (item) => [item.issuer, item.acquiredDate].filter(Boolean).join(' · '),
	},
	education: {
		title: 'school',
		subtitle: (item) => [item.major, item.expectedGraduation].filter(Boolean).join(' · '),
	},
	techStacks: {
		title: 'name',
		subtitle: (item) => [item.category, item.proficiency].filter(Boolean).join(' · '),
	},
	activities: {
		title: 'name',
		subtitle: (item) => [item.role, item.startDate].filter(Boolean).join(' · '),
	},
};
