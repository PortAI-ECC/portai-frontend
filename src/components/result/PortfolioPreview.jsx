import { useEffect, useRef, useState } from 'react';
import styled from '@emotion/styled';
import { templateComponentById } from './templates';

const BASE_WIDTH = 1100;
const THUMB_ZOOM = 0.28;

const Frame = styled.div`
	border-radius: ${({ theme }) => theme.radii.lg};
	background: #fff;
	overflow-y: auto;
	overflow-x: hidden;

	${({ $variant }) => $variant === 'panel' && `height: 680px;`}

	${({ $variant }) =>
		$variant === 'thumb' &&
		`
			aspect-ratio: 3 / 4;
			overflow: hidden;
			pointer-events: none;
		`}
`;

const Stage = styled.div`
	width: ${BASE_WIDTH}px;
	zoom: ${({ $zoom }) => $zoom};
`;

/**
 * 6개 템플릿은 전면 페이지 디자인이라, 좁은 미리보기 칸(panel)이나 피커
 * 썸네일(thumb)에 그대로 넣으면 찌그러진다. CSS zoom 으로 축소한다.
 *
 * transform: scale 이 아니라 zoom 을 쓰는 이유: scale 은 래퍼가 원본 크기의
 * 빈 공간을 그대로 차지해 높이 계산이 따로 필요하지만, zoom 은 레이아웃에
 * 참여해서 래퍼 높이도 축소 비율만큼 같이 줄어든다.
 *
 * full 은 이미 호출부(Frame/Modal Panel)가 컨테이너 폭에 맞춰 스크롤을 제공하므로
 * zoom 을 걸지 않고 템플릿을 그대로 렌더한다.
 */
function PortfolioPreview({ data, templateId, variant = 'full', showPhoto = true }) {
	const containerRef = useRef(null);
	const [zoom, setZoom] = useState(1);
	const needsFit = variant === 'panel';

	useEffect(() => {
		if (!needsFit) return undefined;

		const element = containerRef.current;
		if (!element) return undefined;

		const observer = new ResizeObserver((entries) => {
			const width = entries[0]?.contentRect.width ?? BASE_WIDTH;
			setZoom(Math.min(1, width / BASE_WIDTH));
		});
		observer.observe(element);
		return () => observer.disconnect();
	}, [needsFit]);

	const { Component: Template } = templateComponentById(templateId);

	if (variant === 'full') {
		return <Template data={data} showPhoto={showPhoto} />;
	}

	return (
		<Frame ref={containerRef} $variant={variant} aria-hidden={variant === 'thumb'}>
			<Stage $zoom={variant === 'thumb' ? THUMB_ZOOM : zoom}>
				<Template data={data} showPhoto={showPhoto} />
			</Stage>
		</Frame>
	);
}

export default PortfolioPreview;
