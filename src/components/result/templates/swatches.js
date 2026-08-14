// 템플릿 선택 모달의 미니 미리보기 전용 색 토큰. 실제 템플릿 컴포넌트를 그대로
// 렌더하지 않고(모달 디자인은 원래 모습대로 두기 위해) 각 템플릿의 대표 색만
// 뽑아 얇은 색 막대 3개로 미리 보여준다.
export const TEMPLATE_SWATCH = {
	minimal: {
		bg: '#faf9f7',
		accent: 'oklch(0.52 0.07 145)',
		accentSoft: '#ecebe6',
		radius: '2px',
	},
	colorful: {
		bg: '#fffdf4',
		accent: 'oklch(0.72 0.19 25)',
		accentSoft: '#fff3c4',
		radius: '18px',
	},
	editorial: {
		bg: '#f3f0e9',
		accent: '#b3271e',
		accentSoft: '#e5e1d7',
		radius: '0px',
	},
	classic: {
		bg: '#fbf8f2',
		accent: '#8a6a3b',
		accentSoft: '#efe9dc',
		radius: '4px',
	},
	creative: {
		bg: '#fff7ed',
		accent: '#ff5d73',
		accentSoft: '#ffe1e8',
		radius: '18px',
	},
	simple: {
		bg: '#ffffff',
		accent: '#111111',
		accentSoft: '#f1f1f1',
		radius: '0px',
	},
};
