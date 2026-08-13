import { useEffect } from 'react';
import { createPortal } from 'react-dom';
import styled from '@emotion/styled';

const Backdrop = styled.div`
	position: fixed;
	inset: 0;
	z-index: ${({ theme }) => theme.zIndex.modal};
	display: flex;
	align-items: center;
	justify-content: center;
	padding: 24px;
	background: rgba(44, 12, 107, 0.32);
	backdrop-filter: blur(4px);
`;

const Panel = styled.div`
	width: 100%;
	max-width: ${({ $width }) => $width};
	max-height: 88vh;
	overflow-y: auto;
	background: ${({ theme }) => theme.colors.surfaceSolid};
	border-radius: ${({ theme }) => theme.radii.xl};
	box-shadow: ${({ theme }) => theme.shadows.float};
	padding: 32px;
`;

const Head = styled.header`
	display: flex;
	align-items: center;
	justify-content: space-between;
	margin-bottom: 24px;
`;

const Title = styled.h2`
	font-size: 20px;
	font-weight: 700;
`;

const CloseButton = styled.button`
	font-size: 20px;
	line-height: 1;
	color: ${({ theme }) => theme.colors.textMuted};
	&:hover {
		color: ${({ theme }) => theme.colors.text};
	}
`;

/**
 * dismissible=false 면 X·배경 클릭·Esc 로 못 닫는다. 반드시 뭔가를 골라야
 * 넘어갈 수 있는 최초 진입 모달(예: 템플릿 선택)에 쓴다 — 그 안의 확정 버튼만
 * 닫을 수 있다.
 */
function Modal({ open, onClose, title, width = '720px', children, dismissible = true }) {
	useEffect(() => {
		if (!open || !dismissible) return undefined;

		const handleKeyDown = (event) => {
			if (event.key === 'Escape') onClose();
		};
		document.addEventListener('keydown', handleKeyDown);
		document.body.style.overflow = 'hidden';

		return () => {
			document.removeEventListener('keydown', handleKeyDown);
			document.body.style.overflow = '';
		};
	}, [open, dismissible, onClose]);

	// dismissible=false 여도 스크롤은 여전히 막아야 한다.
	useEffect(() => {
		if (!open || dismissible) return undefined;

		document.body.style.overflow = 'hidden';
		return () => {
			document.body.style.overflow = '';
		};
	}, [open, dismissible]);

	if (!open) return null;

	return createPortal(
		<Backdrop onClick={dismissible ? onClose : undefined}>
			<Panel
				role="dialog"
				aria-modal="true"
				$width={width}
				onClick={(e) => e.stopPropagation()}
			>
				<Head>
					<Title>{title}</Title>
					{dismissible && (
						<CloseButton type="button" onClick={onClose} aria-label="닫기">
							✕
						</CloseButton>
					)}
				</Head>
				{children}
			</Panel>
		</Backdrop>,
		document.body,
	);
}

export default Modal;
