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

// 라벨과 같은 색을 그대로 물려받도록 별도 색을 주지 않는다.
const RequiredMark = styled.span`
	margin-left: 2px;
`;

const Message = styled.p`
	font-size: 12px;
	color: ${({ theme, $error }) => ($error ? theme.colors.danger : theme.colors.textMuted)};
`;

function Field({ label, htmlFor, message, error = false, required = false, children }) {
	return (
		<Wrapper>
			{label && (
				<Label htmlFor={htmlFor}>
					{label}
					{required && <RequiredMark aria-hidden="true">*</RequiredMark>}
				</Label>
			)}
			{children}
			{message && <Message $error={error}>{message}</Message>}
		</Wrapper>
	);
}

export default Field;
