import { useNavigate } from 'react-router-dom';
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

// 주 동작은 항상 오른쪽. 왼쪽 아래에는 옅은 뒤로 가기만 둔다.
const Footer = styled.footer`
	margin-top: 48px;
	display: flex;
	align-items: center;
	justify-content: space-between;
	gap: 16px;
`;

const BackLink = styled.button`
	display: inline-flex;
	align-items: center;
	gap: 8px;
	font-size: 14px;
	color: ${({ theme }) => theme.colors.textMuted};
	opacity: 0.7;
	transition:
		opacity 0.15s,
		color 0.15s;

	&:hover {
		opacity: 1;
		color: ${({ theme }) => theme.colors.textSub};
	}
`;

const Spacer = styled.span``;

function CreateStepLayout({ step, title, description, align = 'left', backTo, footer, children }) {
	const navigate = useNavigate();

	return (
		<>
			<StepProgress current={step} />
			<Title $align={align}>{title}</Title>
			{description && <Description $align={align}>{description}</Description>}
			<Body>{children}</Body>

			{(footer || backTo) && (
				<Footer>
					{backTo ? (
						<BackLink
							type="button"
							onClick={() => navigate(backTo)}
							aria-label="이전 단계로"
						>
							← 이전
						</BackLink>
					) : (
						<Spacer />
					)}
					{footer}
				</Footer>
			)}
		</>
	);
}

export default CreateStepLayout;
