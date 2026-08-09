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

function Modal({ open, onClose, title, width = '720px', children }) {
	useEffect(() => {
		if (!open) return undefined;

		const handleKeyDown = (event) => {
			if (event.key === 'Escape') onClose();
		};
		document.addEventListener('keydown', handleKeyDown);
		document.body.style.overflow = 'hidden';

		return () => {
			document.removeEventListener('keydown', handleKeyDown);
			document.body.style.overflow = '';
		};
	}, [open, onClose]);

	if (!open) return null;

	return createPortal(
		<Backdrop onClick={onClose}>
			<Panel
				role="dialog"
				aria-modal="true"
				$width={width}
				onClick={(e) => e.stopPropagation()}
			>
				<Head>
					<Title>{title}</Title>
					<CloseButton type="button" onClick={onClose} aria-label="닫기">
						✕
					</CloseButton>
				</Head>
				{children}
			</Panel>
		</Backdrop>,
		document.body,
	);
}

export default Modal;
