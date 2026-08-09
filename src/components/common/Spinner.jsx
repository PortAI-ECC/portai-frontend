import styled from '@emotion/styled';
import { keyframes } from '@emotion/react';

const spin = keyframes`
	to { transform: rotate(360deg); }
`;

const Wrapper = styled.div`
	display: flex;
	flex-direction: column;
	align-items: center;
	gap: 16px;
	padding: ${({ $full }) => ($full ? '80px 0' : '24px 0')};
`;

const Circle = styled.div`
	width: ${({ $size }) => $size}px;
	height: ${({ $size }) => $size}px;
	border: 3px solid ${({ theme }) => theme.colors.primarySoft};
	border-top-color: ${({ theme }) => theme.colors.primary};
	border-radius: 50%;
	animation: ${spin} 0.8s linear infinite;
`;

const Message = styled.p`
	font-size: 14px;
	color: ${({ theme }) => theme.colors.textSub};
`;

function Spinner({ size = 36, message, full = false }) {
	return (
		<Wrapper $full={full} role="status" aria-live="polite">
			<Circle $size={size} />
			{message && <Message>{message}</Message>}
		</Wrapper>
	);
}

export default Spinner;
