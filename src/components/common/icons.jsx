// 와이어프레임 7 의 아이콘 두 개. 같은 24px 격자에 맞춰 굵기를 통일한다.

/** 템플릿 변경 — 카드 두 장이 겹쳐 자리를 바꾸는 모양 */
export function SwapCardsIcon(props) {
	return (
		<svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true" {...props}>
			<rect
				x="2.5"
				y="7.5"
				width="12"
				height="14"
				rx="3"
				stroke="currentColor"
				strokeWidth="1.6"
				opacity="0.5"
			/>
			<rect
				x="9.5"
				y="2.5"
				width="12"
				height="14"
				rx="3"
				fill="none"
				stroke="currentColor"
				strokeWidth="1.6"
			/>
		</svg>
	);
}

/** 전체화면 미리보기 — 네 모서리 꺾쇠 */
export function FullscreenIcon(props) {
	return (
		<svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true" {...props}>
			<path
				d="M3 9V4.5A1.5 1.5 0 0 1 4.5 3H9M15 3h4.5A1.5 1.5 0 0 1 21 4.5V9M21 15v4.5a1.5 1.5 0 0 1-1.5 1.5H15M9 21H4.5A1.5 1.5 0 0 1 3 19.5V15"
				stroke="currentColor"
				strokeWidth="1.6"
				strokeLinecap="round"
				strokeLinejoin="round"
			/>
		</svg>
	);
}
