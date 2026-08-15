import { formatMonth, formatPeriod } from '../../utils/date';
import { formatPhone } from '../../utils/phone';
import { DEGREE_LABEL, EDUCATION_STATUS_LABEL } from '../../constants/recordFields';

// emphasis 는 EMPHASIZED_TYPE_OPTIONS(DraftResultPage.jsx)와 값을 맞췄다: 그 중 하나(또는 여럿)를
// 고르면 해당 분류가 맨 위로 올라오고 '강조' 표시가 붙는다.
export const EMPHASIS_OPTIONS = [
	{ value: 'PROJECT', label: '프로젝트' },
	{ value: 'ACTIVITY', label: '활동이력' },
	{ value: 'CONTEST', label: '공모전' },
	{ value: 'CAREER', label: '인턴/경력' },
];

const EMPHASIS_KEY_MAP = {
	PROJECT: 'projects',
	ACTIVITY: 'activities',
	CONTEST: 'awards',
	CAREER: 'career',
};

const TINTS = ['oklch(0.9 0.09 200)', 'oklch(0.91 0.1 145)', 'oklch(0.89 0.09 320)'];

const TEAM_TYPE_ROLE_LABEL = { TEAM: '팀 프로젝트', PERSONAL: '개인 프로젝트' };

const INTEGRATION_LABEL = {
	GITHUB: 'GitHub',
	VELOG: 'Velog',
	NOTION: 'Notion',
	TISTORY: 'Tistory',
};

const SKILL_GROUP_LABEL = {
	LANGUAGE: '언어',
	FRAMEWORK: '프레임워크',
	DATABASE: '데이터 · 인프라',
	CLOUD: '데이터 · 인프라',
	TOOL: '협업',
	OTHER: '기타',
};
const SKILL_GROUP_ORDER = ['언어', '프레임워크', '데이터 · 인프라', '협업', '기타'];

// key/ko/label 은 템플릿 파일들이 그대로 참조하므로 이름을 바꾸지 않는다.
const SECTION_DEFS = [
	{ key: 'career', ko: '인턴 · 경력', label: 'EXPERIENCE' },
	{ key: 'awards', ko: '공모전', label: 'AWARDS' },
	{ key: 'certs', ko: '자격증', label: 'CERTIFICATES' },
	{ key: 'edu', ko: '교육', label: 'EDUCATION' },
	{ key: 'activities', ko: '활동 이력', label: 'ACTIVITIES' },
];

const safeHostname = (value) => {
	try {
		return new URL(value).hostname;
	} catch {
		return null;
	}
};

// /profile 에는 major 도 사진도 없다(전공은 education 레코드, 사진은 서버에 아예 없음).
// 여기서 만드는 profile 의 모든 필드는 항상 string 이라는 게 불변식 — 템플릿들이
// undefined 를 만나 크래시 나는 걸(예: profile.major.split) 원천적으로 막는다.
function buildProfile({ records, basicInfo }) {
	const server = records?.profile ?? {};
	const firstEducation = records?.education?.[0];

	const name = server.name || basicInfo?.name || '';
	const major =
		[firstEducation?.school, firstEducation?.major].filter(Boolean).join(' ') ||
		basicInfo?.major ||
		'';
	const email = server.email || basicInfo?.email || '';
	const phoneRaw = server.phone || basicInfo?.phone || '';

	return {
		name,
		major,
		email,
		phone: phoneRaw ? formatPhone(phoneRaw) : '',
		tagline: server.introOneLiner || basicInfo?.introOneLiner || '',
		desiredJob: server.desiredJob || basicInfo?.desiredJob || '',
		// 아바타 이니셜. 이름이 한 글자뿐이면 그대로 쓴다.
		initials: name.length > 1 ? name.slice(1) : name,
	};
}

function buildLinks(integrations) {
	return (integrations ?? []).map((item) => ({
		id: item.integrationId ?? item.id,
		label: INTEGRATION_LABEL[item.platform] ?? safeHostname(item.value) ?? '링크',
		url: item.value,
	}));
}

// RECORD_FIELDS.projects 에는 기술스택 필드가 없다 — 추측으로 채우지 않고 빈 값으로 둔다.
function buildProjects(projects) {
	return (projects ?? []).map((item, index) => ({
		id: item.projectId ?? item.id ?? index,
		title: item.name ?? '',
		role: [TEAM_TYPE_ROLE_LABEL[item.teamType], item.role].filter(Boolean).join(' · '),
		period: formatPeriod(item.startDate, item.endDate),
		desc: item.description || item.proudestAchievement || item.myContribution || '',
		stack: [],
		stackText: '',
		links: item.githubUrl ? [{ label: 'GitHub', url: item.githubUrl }] : [],
		tint: TINTS[index % TINTS.length],
	}));
}

function buildSkills(techStacks) {
	const groups = new Map();

	(techStacks ?? []).forEach((item) => {
		const label = SKILL_GROUP_LABEL[item.category] ?? SKILL_GROUP_LABEL.OTHER;
		if (!groups.has(label)) groups.set(label, []);
		groups.get(label).push(item.name);
	});

	return SKILL_GROUP_ORDER.filter((label) => groups.has(label)).map((label) => {
		const items = groups.get(label);
		return { label, items, text: items.join(' · ') };
	});
}

function buildSections(records) {
	const itemsByKey = {
		career: (records?.careers ?? []).map((item) => ({
			id: item.careerId ?? item.id,
			title: [item.companyName, item.position].filter(Boolean).join(' '),
			period: formatPeriod(item.startDate, item.endDate),
			desc: [item.duties, item.achievements].filter(Boolean).join(' '),
		})),
		awards: (records?.contests ?? []).map((item) => ({
			id: item.contestId ?? item.id,
			title: item.name ?? '',
			period: formatPeriod(item.startDate, item.endDate),
			desc: [item.host, item.result || (item.awarded ? '수상' : '')]
				.filter(Boolean)
				.join(' · '),
		})),
		certs: (records?.certificates ?? []).map((item) => ({
			id: item.certificateId ?? item.id,
			title: item.name ?? '',
			period: formatMonth(item.acquiredDate),
			desc: [
				item.issuer,
				item.score,
				item.expiryDate && `${formatMonth(item.expiryDate)} 만료`,
			]
				.filter(Boolean)
				.join(' · '),
		})),
		edu: (records?.education ?? []).map((item) => ({
			id: item.educationId ?? item.id,
			title: [item.school, item.major].filter(Boolean).join(' '),
			period: formatMonth(item.expectedGraduation),
			desc: [
				DEGREE_LABEL[item.degree],
				item.doubleMajor && `복수/부전공 ${item.doubleMajor}`,
				item.gpaScore !== null &&
					item.gpaScore !== undefined &&
					`${item.gpaScore}/${item.gpaScale ?? 4.5}`,
				EDUCATION_STATUS_LABEL[item.status],
			]
				.filter(Boolean)
				.join(' · '),
		})),
		activities: (records?.activities ?? []).map((item) => ({
			id: item.activityId ?? item.id,
			title: item.name ?? '',
			period: formatPeriod(item.startDate, item.endDate),
			desc: [item.role, item.description].filter(Boolean).join(' · '),
		})),
	};

	// 항목이 없는 분류는 통째로 빼서, 빈 섹션 헤더가 뜨지 않게 한다.
	return SECTION_DEFS.map((def) => ({ ...def, items: itemsByKey[def.key] ?? [] })).filter(
		(section) => section.items.length > 0,
	);
}

// 선택된 강조 분류를 앞으로 정렬하고 hot 표시를 단다. 정렬은 안정 정렬(ES2019+)이라
// 강조되지 않은 섹션들의 원래 순서(SECTION_DEFS 순서)는 그대로 유지된다.
function orderSections(sections, emphasizedKeys) {
	const rank = (key) => {
		const index = emphasizedKeys.indexOf(key);
		return index === -1 ? Infinity : index;
	};

	return [...sections]
		.sort((a, b) => rank(a.key) - rank(b.key))
		.map((section) => ({ ...section, hot: emphasizedKeys.includes(section.key) }));
}

// 에디토리얼 템플릿은 프로젝트=01, 기술스택=02 를 하드코딩해 왔다. 레코드가 없는
// 사용자는 그 둘이 아예 안 뜰 수 있으므로, 실제로 렌더되는 것만 세어 번호를 매긴다.
function numberSections({ hasProjects, hasSkills, sections }) {
	let counter = 0;
	const projectsNo = hasProjects ? String(++counter).padStart(2, '0') : '';
	const skillsNo = hasSkills ? String(++counter).padStart(2, '0') : '';
	const numbered = sections.map((section) => ({
		...section,
		no: String(++counter).padStart(2, '0'),
	}));

	return { projectsNo, skillsNo, sections: numbered };
}

/**
 * API 레코드(records) + 클라이언트 기본 정보(basicInfo) + AI 자기소개 문단(intro) +
 * 강조 선택(emphasis)을 받아 6개 템플릿이 공통으로 쓰는 모양으로 합친다.
 *
 * api/ 를 import 하지 않는 순수 함수다 — 데이터를 어디서 가져왔든(실제 API 응답이든
 * portfolioSampleRecords.js 의 표본이든) 같은 코드 경로를 타야 매핑 버그를 백엔드 없이도
 * 잡을 수 있다.
 */
export function buildPortfolioTemplateData({ records, basicInfo, intro, emphasis } = {}) {
	const profile = buildProfile({ records, basicInfo });
	const links = buildLinks(records?.integrations);
	const projects = buildProjects(records?.projects);
	const skills = buildSkills(records?.techStacks);
	const rawSections = buildSections(records);

	const emphasisList = (Array.isArray(emphasis) ? emphasis : [emphasis]).filter(Boolean);
	const emphasizedKeys =
		emphasisList.length > 0
			? emphasisList.map((value) => EMPHASIS_KEY_MAP[value]).filter(Boolean)
			: [EMPHASIS_KEY_MAP.PROJECT];

	const { projectsNo, skillsNo, sections } = numberSections({
		hasProjects: projects.length > 0,
		hasSkills: skills.length > 0,
		sections: orderSections(rawSections, emphasizedKeys),
	});

	return {
		profile,
		mailto: profile.email ? `mailto:${profile.email}` : '',
		links,
		projects,
		skills,
		sections,
		projectsNo,
		skillsNo,
		projectsHot: emphasizedKeys.includes('projects'),
		intro: (intro ?? '').trim(),
		isEmpty: projects.length === 0 && skills.length === 0 && sections.length === 0,
	};
}
