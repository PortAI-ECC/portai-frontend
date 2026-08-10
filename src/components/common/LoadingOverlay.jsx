import { createPortal } from 'react-dom';
import styled from '@emotion/styled';
import { keyframes } from '@emotion/react';
import AxolotlPixel from '../character/AxolotlPixel';

// ProgressOverlay 와 같은 배경·판 위에 올린다. 둘의 차이는 '얼마나 남았는지
// 아는가' 하나뿐이라, 생김새까지 달라지면 다른 서비스처럼 보인다.
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
	padding: 48px 40px;
	text-align: center;
	background: ${({ theme }) => theme.colors.surfaceSolid};
	border-radius: ${({ theme }) => theme.radii.xl};
	box-shadow: ${({ theme }) => theme.shadows.float};
`;

const spin = keyframes`
	to { transform: rotate(360deg); }
`;

const Ring = styled.div`
	position: relative;
	width: 116px;
	height: 116px;
	margin: 0 auto 28px;
	display: grid;
	place-items: center;
`;

// 회전은 테두리에만 준다. 안의 우파까지 같이 돌면 어지럽다.
const Track = styled.div`
	position: absolute;
	inset: 0;
	border: 7px solid ${({ theme }) => theme.colors.primarySoft};
	border-top-color: ${({ theme }) => theme.colors.primary};
	border-radius: 50%;
	animation: ${spin} 0.9s linear infinite;

	@media (prefers-reduced-motion: reduce) {
		animation-duration: 2.4s;
	}
`;

const Message = styled.p`
	font-size: 15px;
	font-weight: 500;
	color: ${({ theme }) => theme.colors.textSub};
`;

/**
 * 얼마나 걸릴지 모르는 대기에 쓰는 사이트 공용 로딩 모달.
 *
 * 진행률을 셀 수 있는 포트폴리오 생성만 ProgressOverlay(진행바)를 쓰고,
 * 나머지 화면의 기다림은 전부 이것으로 통일한다.
 */
function LoadingOverlay({ open, message = '잠시만 기다려 주세요' }) {
	if (!open) return null;

	return createPortal(
		<Backdrop role="alertdialog" aria-busy="true" aria-label={message}>
			<Panel>
				<Ring aria-hidden="true">
					<Track />
					<AxolotlPixel size={56} motion="hum" title="" />
				</Ring>
				<Message>{message}</Message>
			</Panel>
		</Backdrop>,
		document.body,
	);
}

export default LoadingOverlay;
