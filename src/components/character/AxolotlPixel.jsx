import { useMemo } from 'react';
import styled from '@emotion/styled';
import { css, keyframes } from '@emotion/react';
import { buildGrid, buildPalette, COLS, ROWS } from './axolotlGrid';

// 가만히 떠 있는 모션. 진행률 화면처럼 계속 움직여야 할 때 쓴다.
const float = keyframes`
	0%, 100% { transform: translateY(0); }
	50% { transform: translateY(-6px); }
`;

// 새 질문을 물어올 때 세 번. 통통 튀지 않고 위에서 잠깐 머물렀다 천천히 내려온다.
// 뛰는 폭은 우파 몸집(81px)에 맞춰 둔다. 말풍선과 겹치는 구간이 생기는데,
// 그때 우파가 앞에 오도록 AiQuestionCharacter 의 CharacterSlot 이 z-index 를 올린다.
const bounce = keyframes`
	0% { transform: translateY(0); }
	30% { transform: translateY(-15px); }
	55% { transform: translateY(-15px); }
	100% { transform: translateY(0); }
`;

// 로딩 원 안에서 제자리 진동. 뜨는 게 아니라 몸을 짧게 떠는 느낌이라
// 이동 폭을 아주 작게 두고 좌우로도 살짝 흔든다.
const hum = keyframes`
	0%, 100% { transform: translate(0, 0); }
	25% { transform: translate(-1px, -1.5px); }
	50% { transform: translate(0, -2.5px); }
	75% { transform: translate(1px, -1.5px); }
`;

const MOTION = {
	none: null,
	float: css`
		animation: ${float} 2.4s ease-in-out infinite;
	`,
	bounce: css`
		animation: ${bounce} 0.75s cubic-bezier(0.4, 0, 0.3, 1) 2;
	`,
	hum: css`
		animation: ${hum} 0.9s ease-in-out infinite;
	`,
};

const Svg = styled.svg`
	display: block;
	width: ${({ $size }) => $size}px;
	height: auto;
	${({ $motion }) => MOTION[$motion]}

	@media (prefers-reduced-motion: reduce) {
		animation: none;
	}
`;

/**
 * 도트 우파루파. 원본은 675개의 div 를 깔았지만,
 * 여기서는 같은 격자를 1x1 rect 로 그려 노드 수를 줄인다.
 *
 * motion 이 'bounce' 일 때는 animationKey 가 바뀔 때마다 애니메이션이 다시 돈다.
 */
function AxolotlPixel({
	baseColor = '#F0A8D8',
	size = 120,
	motion = 'none',
	animationKey,
	title = '우파루파 캐릭터',
}) {
	const cells = useMemo(() => {
		const grid = buildGrid();
		const palette = buildPalette(baseColor);
		const result = [];

		for (let y = 0; y < ROWS; y += 1) {
			for (let x = 0; x < COLS; x += 1) {
				const color = palette[grid[y][x]];
				if (color) result.push({ x, y, color });
			}
		}

		return result;
	}, [baseColor]);

	return (
		<Svg
			key={animationKey}
			$size={size}
			$motion={motion}
			viewBox={`0 0 ${COLS} ${ROWS}`}
			shapeRendering="crispEdges"
			role="img"
			aria-label={title}
		>
			{cells.map((cell) => (
				<rect
					key={`${cell.y}-${cell.x}`}
					x={cell.x}
					y={cell.y}
					width="1"
					height="1"
					fill={cell.color}
				/>
			))}
		</Svg>
	);
}

export default AxolotlPixel;
