import MinimalTemplate from './MinimalTemplate';
import ColorfulTemplate from './ColorfulTemplate';
import EditorialTemplate from './EditorialTemplate';
import ClassicTemplate from './ClassicTemplate';
import CreativeTemplate from './CreativeTemplate';
import SimpleTemplate from './SimpleTemplate';

// 앞의 3종은 Claude Design 프로젝트("포트폴리오 사이트 템플릿 선택")를 그대로 구현한 것,
// 뒤의 3종은 PortAI 자체 톤 실험(클래식·크리에이티브·심플)을 같은 구조화 데이터
// (portfolioTemplateData)에 맞춰 옮긴 것. 데모·피커·실제 미리보기가 이 목록 하나를 공유한다.
export const PORTFOLIO_TEMPLATE_LIST = [
	{ id: 'minimal', name: '미니멀', Component: MinimalTemplate },
	{ id: 'colorful', name: '컬러풀', Component: ColorfulTemplate },
	{ id: 'editorial', name: '에디토리얼', Component: EditorialTemplate },
	{ id: 'classic', name: '클래식', Component: ClassicTemplate },
	{ id: 'creative', name: '크리에이티브', Component: CreativeTemplate },
	{ id: 'simple', name: '심플', Component: SimpleTemplate },
];

// 예전 3종 실험(portfolioTemplates.js)이 남긴 template-1/2/3 이 사용자 브라우저에
// 이미 저장돼 있다(zustand persist, 버전 없음). 이름이 정확히 대응돼 무손실로 옮긴다.
const LEGACY_TEMPLATE_ID = {
	'template-1': 'classic',
	'template-2': 'creative',
	'template-3': 'simple',
};

export const normalizeTemplateId = (id) => LEGACY_TEMPLATE_ID[id] ?? id;

export const templateComponentById = (id) =>
	PORTFOLIO_TEMPLATE_LIST.find((template) => template.id === normalizeTemplateId(id)) ??
	PORTFOLIO_TEMPLATE_LIST[0];
