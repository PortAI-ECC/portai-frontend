import { createPortal } from 'react-dom';
import styled from '@emotion/styled';
import { keyframes } from '@emotion/react';

const Backdrop = styled.div`
	position: fixed;
	inset: 0;
	z-index: ${({ theme }) => theme.zIndex.modal};
	display: grid;
	place-items: center;
	background: rgba(44, 12, 107, 0.18);
	backdrop-filter: blur(10px);
`;

const Panel = styled.div`
	width: 100%;
	max-width: 420px;
	padding: 40px;
	text-align: center;
	background: ${({ theme }) => theme.colors.surfaceSolid};
	border-radius: ${({ theme }) => theme.radii.xl};
	box-shadow: ${({ theme }) => theme.shadows.float};
`;

const Title = styled.h2`
	font-size: 18px;
	font-weight: 700;
	margin-bottom: 8px;
`;

const Message = styled.p`
	font-size: 14px;
	color: ${({ theme }) => theme.colors.textSub};
	margin-bottom: 28px;
	min-height: 21px;
`;

const Percent = styled.p`
	font-family: ${({ theme }) => theme.font.display};
	font-size: 44px;
	font-weight: 600;
	letter-spacing: -0.02em;
	margin-bottom: 20px;
`;

const Track = styled.div`
	height: 8px;
	border-radius: 999px;
	background: ${({ theme }) => theme.colors.primarySoft};
	overflow: hidden;
`;

const shimmer = keyframes`
	from { background-position: 0 0; }
	to { background-position: 200px 0; }
`;

const Bar = styled.div`
	height: 100%;
	width: ${({ $value }) => $value}%;
	border-radius: 999px;
	background: ${({ theme }) => theme.gradients.brand};
	background-size: 200px 100%;
	animation: ${shimmer} 1.2s linear infinite;
	transition: width 0.4s ease;
`;

function ProgressOverlay({ open, value = 0, title = '포트폴리오를 생성하고 있어요', message }) {
	if (!open) return null;

	const percent = Math.min(100, Math.max(0, Math.round(value)));

	return createPortal(
		<Backdrop role="alertdialog" aria-busy="true" aria-label={title}>
			<Panel>
				<Title>{title}</Title>
				<Message>{message}</Message>
				<Percent>{percent}%</Percent>
				<Track>
					<Bar
						$value={percent}
						role="progressbar"
						aria-valuenow={percent}
						aria-valuemin={0}
						aria-valuemax={100}
					/>
				</Track>
			</Panel>
		</Backdrop>,
		document.body,
	);
}

export default ProgressOverlay;
