// 템플릿 미리보기/피커 썸네일이 쓰는 표본 데이터. 실제 API 응답과 같은 모양
// (constants/recordFields.js 의 RECORD_FIELDS 필드명)으로 맞춰 둬서, portfolioTemplateData.js
// 의 매핑 함수를 백엔드 없이도 실제와 같은 코드 경로로 검증할 수 있다.
export const SAMPLE_PORTFOLIO_RECORDS = {
	profile: {
		userId: 1,
		name: '김도현',
		email: 'dohyun.kim@example.com',
		phone: '01023456789',
		introOneLiner:
			'데이터가 쌓이는 구조를 설계하고, 그 데이터를 사람이 읽을 수 있는 화면까지 옮기는 일을 좋아합니다.',
		desiredJob: '백엔드 개발자',
		desiredCompany: '',
	},

	projects: [
		{
			projectId: 1,
			name: '캠퍼스 셔틀 실시간 위치 서비스',
			startDate: '2025-03-01',
			endDate: '2025-06-30',
			teamType: 'TEAM',
			role: '백엔드/데이터 담당',
			githubUrl: 'https://github.com/example/campus-shuttle',
			myContribution: 'GPS 수집 파이프라인과 도착 예측 API를 담당했습니다.',
			proudestAchievement: '평균 응답 120ms 달성',
			description:
				'GPS 단말 로그를 5초 단위로 수집해 도착 예측을 제공했습니다. 학기 중 실사용자 1,200명, 평균 응답 120ms를 기록했습니다.',
		},
		{
			projectId: 2,
			name: '실험실 센서 데이터 수집 파이프라인',
			startDate: '2024-09-01',
			endDate: '2024-12-31',
			teamType: 'PERSONAL',
			role: '',
			githubUrl: 'https://github.com/example/lab-sensor-pipeline',
			myContribution: '',
			proudestAchievement: '',
			description:
				'연구실 온습도·전력 센서 12대의 데이터를 자동 적재하고 이상치를 알림으로 보내는 파이프라인을 만들었습니다.',
		},
		{
			projectId: 3,
			name: "스터디 블로그 'ToyBuild'",
			startDate: '2024-01-01',
			endDate: null,
			teamType: 'PERSONAL',
			role: '',
			githubUrl: '',
			myContribution: '',
			proudestAchievement: '',
			description:
				'주 1회 학습 기록을 남깁니다. 자료구조 구현, 배포 트러블슈팅, 논문 리뷰를 주로 씁니다.',
		},
	],

	contests: [
		{
			contestId: 1,
			name: '공공데이터 활용 경진대회',
			host: '한국데이터산업진흥원',
			startDate: '2025-10-01',
			endDate: '2025-10-01',
			role: '분석 및 발표',
			result: '장려상',
			awarded: true,
		},
		{
			contestId: 2,
			name: '교내 캡스톤 아이디어 공모전',
			host: 'OO대학교',
			startDate: '2024-11-01',
			endDate: '2024-11-01',
			role: '기획',
			result: '2위',
			awarded: true,
		},
	],

	careers: [
		{
			careerId: 1,
			companyName: '(주)그린테크',
			position: '데이터플랫폼팀 인턴',
			startDate: '2025-07-01',
			endDate: '2025-08-31',
			duties: '사내 센서 데이터 적재 배치 운영',
			achievements: '실행 시간을 42분에서 9분으로 줄였습니다.',
		},
		{
			careerId: 2,
			companyName: '컴퓨터공학과',
			position: '전산실 조교',
			startDate: '2024-03-01',
			endDate: '2024-12-31',
			duties: '실습 서버 계정·권한 관리',
			achievements: '1학년 실습 조교를 맡았습니다.',
		},
	],

	certificates: [
		{
			certificateId: 1,
			name: 'SQL 개발자 (SQLD)',
			issuer: '한국데이터산업진흥원',
			acquiredDate: '2025-06-01',
			expiryDate: null,
			score: '',
		},
		{
			certificateId: 2,
			name: '정보처리기사',
			issuer: '한국산업인력공단',
			acquiredDate: '2025-05-01',
			expiryDate: null,
			score: '',
		},
		{
			certificateId: 3,
			name: 'TOEIC',
			issuer: 'ETS',
			acquiredDate: '2024-11-01',
			expiryDate: '2026-11-01',
			score: '875',
		},
	],

	education: [
		{
			educationId: 1,
			school: '서울과학기술대학교',
			degree: 'BACHELOR',
			major: '컴퓨터공학과',
			doubleMajor: '',
			gpaScore: 4.1,
			gpaScale: 4.5,
			status: 'EXPECTED_GRADUATION',
			expectedGraduation: '2026-02-28',
		},
	],

	techStacks: [
		{ techStackId: 1, name: 'Python', category: 'LANGUAGE', proficiency: 'ADVANCED' },
		{ techStackId: 2, name: 'Java', category: 'LANGUAGE', proficiency: 'INTERMEDIATE' },
		{ techStackId: 3, name: 'TypeScript', category: 'LANGUAGE', proficiency: 'INTERMEDIATE' },
		{ techStackId: 4, name: 'C', category: 'LANGUAGE', proficiency: 'BEGINNER' },
		{ techStackId: 5, name: 'Django', category: 'FRAMEWORK', proficiency: 'ADVANCED' },
		{ techStackId: 6, name: 'FastAPI', category: 'FRAMEWORK', proficiency: 'ADVANCED' },
		{ techStackId: 7, name: 'React', category: 'FRAMEWORK', proficiency: 'INTERMEDIATE' },
		{ techStackId: 8, name: 'PyTorch', category: 'FRAMEWORK', proficiency: 'INTERMEDIATE' },
		{ techStackId: 9, name: 'PostgreSQL', category: 'DATABASE', proficiency: 'ADVANCED' },
		{ techStackId: 10, name: 'Docker', category: 'CLOUD', proficiency: 'INTERMEDIATE' },
		{ techStackId: 11, name: 'AWS EC2/S3', category: 'CLOUD', proficiency: 'INTERMEDIATE' },
		{ techStackId: 12, name: 'Airflow', category: 'CLOUD', proficiency: 'INTERMEDIATE' },
		{ techStackId: 13, name: 'Git', category: 'TOOL', proficiency: 'ADVANCED' },
		{ techStackId: 14, name: 'Notion', category: 'TOOL', proficiency: 'ADVANCED' },
		{ techStackId: 15, name: 'Figma', category: 'TOOL', proficiency: 'INTERMEDIATE' },
		{ techStackId: 16, name: 'Jira', category: 'TOOL', proficiency: 'INTERMEDIATE' },
	],

	activities: [
		{
			activityId: 1,
			name: '학과 알고리즘 스터디 운영',
			startDate: '2024-03-01',
			endDate: '2025-06-30',
			role: '운영진',
			description: '주 1회 문제 풀이 스터디를 기획하고 12명 규모로 운영했습니다.',
		},
		{
			activityId: 2,
			name: 'IT 연합동아리 ECC 15기 개발팀',
			startDate: '2025-03-01',
			endDate: null,
			role: '개발팀원',
			description: '팀 프로젝트 2건 참여, 백엔드 세션 발표 3회.',
		},
	],

	integrations: [
		{ integrationId: 1, value: 'https://github.com/dohyunkim', platform: 'GITHUB' },
		{ integrationId: 2, value: 'https://velog.io/@dohyunkim', platform: 'VELOG' },
	],
};

/** 레코드가 하나도 없는 신규 사용자 상태. 빈 화면 검증에 쓴다. */
export const EMPTY_PORTFOLIO_RECORDS = {
	profile: {
		userId: null,
		name: '',
		email: '',
		phone: '',
		introOneLiner: '',
		desiredJob: '',
		desiredCompany: '',
	},
	projects: [],
	contests: [],
	careers: [],
	certificates: [],
	education: [],
	techStacks: [],
	activities: [],
	integrations: [],
};
