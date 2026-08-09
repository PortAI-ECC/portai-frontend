import styled from '@emotion/styled';

const Wrapper = styled.div`
	display: flex;
	flex-direction: column;
	gap: 8px;
`;

const Label = styled.label`
	font-size: 14px;
	font-weight: 500;
	color: ${({ theme }) => theme.colors.textSub};
`;

const Message = styled.p`
	font-size: 12px;
	color: ${({ theme, $error }) => ($error ? theme.colors.danger : theme.colors.textMuted)};
`;

function Field({ label, htmlFor, message, error = false, children }) {
	return (
		<Wrapper>
			{label && <Label htmlFor={htmlFor}>{label}</Label>}
			{children}
			{message && <Message $error={error}>{message}</Message>}
		</Wrapper>
	);
}

export default Field;
