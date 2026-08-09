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
