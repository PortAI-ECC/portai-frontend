import { useMemo } from 'react';
import styled from '@emotion/styled';
import { buildMiniIconCells, MINI_ICON_COLS, MINI_ICON_ROWS } from './axolotlGrid';

const Svg = styled.svg`
	display: block;
	width: ${({ $size }) => $size}px;
	height: auto;
	flex: none;
`;

/** 입력창 안내글자 옆에 붙는 작은 회색 우파 아이콘. */
function AxolotlMiniIcon({ size = 20, title = '우파 아이콘' }) {
	const cells = useMemo(() => buildMiniIconCells(), []);

	return (
		<Svg
			$size={size}
			viewBox={`0 0 ${MINI_ICON_COLS} ${MINI_ICON_ROWS}`}
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

export default AxolotlMiniIcon;
