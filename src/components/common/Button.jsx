import styled from '@emotion/styled';
import { css } from '@emotion/react';

const SIZES = {
	sm: css`
		height: 36px;
		padding: 0 16px;
		font-size: 13px;
	`,
	md: css`
		height: 44px;
		padding: 0 20px;
		font-size: 14px;
	`,
	lg: css`
		height: 48px;
		padding: 0 28px;
		font-size: 15px;
	`,
};

const variantStyle = (theme, variant) =>
	({
		primary: css`
			background: ${theme.gradients.brand};
			color: #fff;
			box-shadow: ${theme.shadows.card};
			&:hover:not(:disabled) {
				filter: brightness(1.06);
			}
		`,
		secondary: css`
			background: ${theme.colors.surfaceSolid};
			color: ${theme.colors.text};
			border: 1px solid ${theme.colors.border};
			&:hover:not(:disabled) {
				background: ${theme.colors.primarySoft};
			}
		`,
		ghost: css`
			background: transparent;
			color: ${theme.colors.textSub};
			&:hover:not(:disabled) {
				color: ${theme.colors.primary};
			}
		`,
	})[variant];

const StyledButton = styled.button`
	display: inline-flex;
	align-items: center;
	justify-content: center;
	gap: 8px;
	border-radius: ${({ theme }) => theme.radii.pill};
	font-weight: 700;
	white-space: nowrap;
	transition:
		filter 0.15s,
		background 0.15s,
		color 0.15s;

	${({ size }) => SIZES[size]}
	${({ theme, variant }) => variantStyle(theme, variant)}
	${({ fullWidth }) =>
		fullWidth &&
		css`
			width: 100%;
		`}

	&:disabled {
		opacity: 0.45;
		cursor: not-allowed;
	}
`;

function Button({
	variant = 'primary',
	size = 'md',
	fullWidth = false,
	type = 'button',
	...props
}) {
	return (
		<StyledButton variant={variant} size={size} fullWidth={fullWidth} type={type} {...props} />
	);
}

export default Button;
