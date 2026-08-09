export const theme = {
	colors: {
		// 발표자료 파스텔 메시 그라데이션에서 뽑은 팔레트
		pageBase: '#E9E6F7',
		mint: '#E4F7F4',
		periwinkle: '#B9C6FF',
		lavender: '#D9C4FF',
		pink: '#FFC6EC',

		primary: '#7B3FF2',
		primaryHover: '#6A2FE0',
		primarySoft: '#EFE7FF',

		text: '#2C0C6B',
		textSub: '#6B5A93',
		textMuted: '#9C8FBA',

		surface: 'rgba(255, 255, 255, 0.72)',
		surfaceSolid: '#FFFFFF',
		border: 'rgba(124, 92, 200, 0.18)',
		// 표지의 얇은 구분선. 배경 위에 겹칠 때 톤이 튀지 않도록 진보라를 옅게 쓴다.
		hairline: 'rgba(44, 12, 107, 0.28)',

		danger: '#E14B6A',
		success: '#26B49A',
	},

	gradients: {
		// 발표자료 표지의 메시 그라데이션. 단일 linear 로는 가운데가 밝게 비는 느낌이 안 나와서
		// 색점을 radial 로 여러 개 겹쳐 재현한다.
		page: `
			radial-gradient(40% 40% at 2% 4%, #DFF5F0 0%, rgba(223, 245, 240, 0) 62%),
			radial-gradient(52% 46% at 90% 6%, #FFA1E2 0%, rgba(255, 161, 226, 0) 62%),
			radial-gradient(46% 42% at 32% 24%, #DBA9F2 0%, rgba(219, 169, 242, 0) 66%),
			radial-gradient(62% 56% at 10% 80%, #A98CF1 0%, rgba(169, 140, 241, 0) 62%),
			radial-gradient(46% 46% at 97% 62%, #FDF3F7 0%, rgba(253, 243, 247, 0) 70%),
			radial-gradient(58% 52% at 56% 54%, #F3F1FC 0%, rgba(243, 241, 252, 0) 72%)
		`,
		brand: 'linear-gradient(90deg, #7B3FF2 0%, #C86DD7 100%)',
	},

	radii: {
		sm: '8px',
		md: '12px',
		lg: '16px',
		xl: '24px',
		pill: '999px',
	},

	shadows: {
		card: '0 8px 32px rgba(90, 60, 160, 0.12)',
		float: '0 16px 48px rgba(90, 60, 160, 0.20)',
	},

	font: {
		family: "'Noto Sans KR', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
		// 표지의 기하학적 대문자용. 한글은 Poppins 에 없으므로 Noto Sans KR 로 자연히 넘어간다.
		display: "'Poppins', 'Noto Sans KR', -apple-system, sans-serif",
	},

	layout: {
		// 데스크톱 전용이라 넉넉하게. 좁게 보여야 하는 화면은 각자 max-width 를 건다.
		maxWidth: '1600px',
		headerHeight: '72px',
	},

	zIndex: {
		header: 100,
		modal: 1000,
	},
};
