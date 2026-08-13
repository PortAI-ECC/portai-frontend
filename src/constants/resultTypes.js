// DB 명세서 generation_results.type ENUM 과 같은 키.
//
// 이 서비스가 만드는 결과물은 '자기소개 사이트'라, 예상 면접 질문
// (INTERVIEW_QUESTIONS)은 그 안에 들어가면 어색해 화면에서 빼 뒀다.
// 어디에 두는 게 자연스러운지 정해지면 그때 되살린다.
export const RESULT_SECTIONS = [
	{ key: 'SELF_INTRODUCTION', label: '자기소개' },
	{ key: 'RESUME', label: '이력서' },
	{ key: 'PORTFOLIO', label: '포트폴리오' },
	{ key: 'PROJECT_INTRO', label: '프로젝트 소개' },
];

export const RESULT_KEYS = RESULT_SECTIONS.map(({ key }) => key);

export const RESULT_LABEL = Object.fromEntries(
	RESULT_SECTIONS.map(({ key, label }) => [key, label]),
);
