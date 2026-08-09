import styled from '@emotion/styled';
import StepProgress from './StepProgress';

const Title = styled.h1`
	font-size: 28px;
	font-weight: 900;
	text-align: ${({ $align }) => $align};
`;

const Description = styled.p`
	margin-top: 12px;
	font-size: 14px;
	color: ${({ theme }) => theme.colors.textSub};
	text-align: ${({ $align }) => $align};
`;

const Body = styled.div`
	margin-top: 32px;
`;

const Footer = styled.footer`
	margin-top: 48px;
	display: flex;
	align-items: center;
	justify-content: space-between;
	gap: 16px;
`;

function CreateStepLayout({ step, title, description, align = 'left', footer, children }) {
	return (
		<>
			<StepProgress current={step} />
			<Title $align={align}>{title}</Title>
			{description && <Description $align={align}>{description}</Description>}
			<Body>{children}</Body>
			{footer && <Footer>{footer}</Footer>}
		</>
	);
}

export default CreateStepLayout;
