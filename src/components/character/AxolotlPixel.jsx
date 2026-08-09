import { useMemo } from 'react';
import styled from '@emotion/styled';
import { keyframes } from '@emotion/react';
import { buildGrid, buildPalette, COLS, ROWS } from './axolotlGrid';

const bob = keyframes`
	0%, 100% { transform: translateY(0); }
	50% { transform: translateY(-6px); }
`;

const Svg = styled.svg`
	display: block;
	width: ${({ $size }) => $size}px;
	height: auto;
	animation: ${bob} 3.2s ease-in-out infinite;

	@media (prefers-reduced-motion: reduce) {
		animation: none;
	}
`;

/**
 * 도트 우파루파. 원본은 675개의 div 를 깔았지만,
 * 여기서는 같은 격자를 1x1 rect 로 그려 노드 수를 줄인다.
 */
function AxolotlPixel({ baseColor = '#F6A8C9', size = 120, title = '우파루파 캐릭터' }) {
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
			$size={size}
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
