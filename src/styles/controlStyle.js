/**
 * 눈에서만 감추고 포커스는 살려 두는 방법.
 *
 * display:none 은 탭 순서에서 아예 빠져서, label 로 감싼 파일 입력이
 * 마우스로만 열리고 키보드로는 닿지 않는다. 화면 밖으로 밀어내는 대신
 * 1px 로 잘라 두면 감춰 보이면서도 탭으로 도달할 수 있다.
 * 감춰진 입력이 포커스를 받으면 감싼 label 에 :focus-within 으로 테두리를 준다.
 */
export const visuallyHidden = `
	position: absolute;
	width: 1px;
	height: 1px;
	padding: 0;
	margin: -1px;
	border: 0;
	overflow: hidden;
	clip-path: inset(50%);
	white-space: nowrap;
`;

// Input / Textarea 가 공유하는 폼 컨트롤 외형.
export const controlStyle = ({ theme }) => `
	width: 100%;
	background: ${theme.colors.surface};
	border: 1px solid ${theme.colors.border};
	border-radius: ${theme.radii.md};
	padding: 12px 16px;
	font-size: 14px;
	transition: border-color 0.15s, background 0.15s;

	&::placeholder {
		color: ${theme.colors.textMuted};
	}

	&:focus {
		outline: none;
		border-color: ${theme.colors.primary};
		background: ${theme.colors.surfaceSolid};
	}
`;
