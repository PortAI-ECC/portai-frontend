import { useEffect, useId, useRef } from 'react';
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

	/* 안에 누를 것이 하나도 없을 때만 패널 자신이 포커스를 받는다.
	   그때 테두리까지 그리면 창 전체에 줄이 쳐진 것처럼 보여 표시는 생략한다. */
	&:focus {
		outline: none;
	}
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

const FOCUSABLE = [
	'a[href]',
	'button:not(:disabled)',
	'input:not(:disabled)',
	'select:not(:disabled)',
	'textarea:not(:disabled)',
	'[tabindex]:not([tabindex="-1"])',
].join(', ');

// 지금 실제로 화면에 있는 것만 모은다. 파일 입력처럼 1px 로 감춰 둔 것은
// 여전히 탭으로 닿아야 하므로 크기가 0 인 것만 걸러 낸다.
const focusableIn = (root) =>
	Array.from(root?.querySelectorAll(FOCUSABLE) ?? []).filter(
		(element) => element.offsetWidth > 0 || element.offsetHeight > 0,
	);

/**
 * dismissible=false 면 X·배경 클릭·Esc 로 못 닫는다. 반드시 뭔가를 골라야
 * 넘어갈 수 있는 최초 진입 모달(예: 템플릿 선택)에 쓴다 — 그 안의 확정 버튼만
 * 닫을 수 있다.
 *
 * closeOnBackdrop=false 면 배경 클릭만 막고 X·Esc 는 그대로 둔다. 고르는 중에
 * 실수로 바깥을 눌러 선택이 날아가면 안 되는 모달에 쓴다.
 *
 * 열려 있는 동안 포커스는 패널 안에 가둔다. 그러지 않으면 탭이 뒤쪽 화면의
 * 입력칸으로 넘어가는데, 화면을 못 보는 사람에게는 모달이 닫힌 것처럼 읽힌다.
 */
function Modal({
	open,
	onClose,
	title,
	width = '720px',
	children,
	dismissible = true,
	closeOnBackdrop = true,
}) {
	const titleId = useId();
	const panelRef = useRef(null);
	// 모달을 열기 직전에 포커스가 있던 자리. 닫고 나면 여기로 돌려준다.
	const returnToRef = useRef(null);

	// 뒤쪽 화면이 스크롤되지 않게 막는다(닫는 방법과는 무관하다).
	useEffect(() => {
		if (!open) return undefined;

		document.body.style.overflow = 'hidden';
		return () => {
			document.body.style.overflow = '';
		};
	}, [open]);

	// 열리면 포커스를 패널 안으로 들이고, 닫히면 원래 있던 자리로 되돌린다.
	useEffect(() => {
		if (!open) return undefined;

		returnToRef.current = document.activeElement;
		const [first] = focusableIn(panelRef.current);
		(first ?? panelRef.current)?.focus();

		return () => {
			returnToRef.current?.focus?.();
		};
	}, [open]);

	// Esc 로 닫기, Tab 은 패널 안에서만 돌게 한다.
	useEffect(() => {
		if (!open) return undefined;

		const handleKeyDown = (event) => {
			if (event.key === 'Escape') {
				if (dismissible) onClose();
				return;
			}

			if (event.key !== 'Tab') return;

			const panel = panelRef.current;
			const items = focusableIn(panel);

			// 누를 것이 하나도 없으면 탭으로 빠져나갈 곳도 없어야 한다.
			if (items.length === 0) {
				event.preventDefault();
				return;
			}

			const first = items[0];
			const last = items[items.length - 1];
			const active = document.activeElement;
			const outside = !panel?.contains(active);

			if (event.shiftKey && (active === first || outside)) {
				event.preventDefault();
				last.focus();
			} else if (!event.shiftKey && (active === last || outside)) {
				event.preventDefault();
				first.focus();
			}
		};

		document.addEventListener('keydown', handleKeyDown);
		return () => document.removeEventListener('keydown', handleKeyDown);
	}, [open, dismissible, onClose]);

	if (!open) return null;

	return createPortal(
		<Backdrop onClick={dismissible && closeOnBackdrop ? onClose : undefined}>
			<Panel
				ref={panelRef}
				role="dialog"
				aria-modal="true"
				aria-labelledby={titleId}
				tabIndex={-1}
				$width={width}
				onClick={(e) => e.stopPropagation()}
			>
				<Head>
					<Title id={titleId}>{title}</Title>
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
