// profile.desiredJob 은 자유 텍스트가 아니라 enum 이다.
// 백엔드가 실제로 받는 값 목록을 확정해 주면 여기만 맞추면 된다.
export const DESIRED_JOBS = [
	{ value: '', label: '비워두면 AI가 추천해드려요' },
	{ value: 'FRONTEND', label: '프론트엔드' },
	{ value: 'BACKEND', label: '백엔드' },
	{ value: 'FULLSTACK', label: '풀스택' },
	{ value: 'MOBILE', label: '모바일' },
	{ value: 'DATA', label: '데이터' },
	{ value: 'AI', label: 'AI/ML' },
	{ value: 'DESIGN', label: '디자인' },
	{ value: 'PM', label: '기획/PM' },
];
