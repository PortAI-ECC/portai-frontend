// 마이페이지 카드와 자유 텍스트 입력 토글이 공유하는 활동 이력 분류.
// key 는 API 명세서의 리소스 경로와 1:1 로 대응된다.
export const RECORD_CATEGORIES = [
	{ key: 'contests', label: '공모전' },
	{ key: 'careers', label: '인턴/경력' },
	{ key: 'certificates', label: '자격증' },
	{ key: 'education', label: '교육' },
	{ key: 'techStacks', label: '기술스택' },
	// 화면 제목이 이미 '활동이력'이라 여기서는 '기타'로만 둔다.
	{ key: 'activities', label: '기타' },
];
