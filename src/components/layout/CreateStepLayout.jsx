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

// 주 동작(오른쪽)보다 약해야 하지만, 옅은 글자만 두니 잘 안 보인다는 피드백을
// 받아 테두리 있는 버튼 모양으로 올린다. 색은 채우지 않아 위계는 그대로 둔다.
const BackLink = styled.button`
	display: inline-flex;
	align-items: center;
	gap: 8px;
	height: 44px;
	padding: 0 20px;
	border-radius: ${({ theme }) => theme.radii.pill};
	border: 1px solid ${({ theme }) => theme.colors.border};
	background: ${({ theme }) => theme.colors.surface};
	font-size: 14px;
	font-weight: 700;
	color: ${({ theme }) => theme.colors.textSub};
	transition:
		background 0.15s,
		border-color 0.15s,
		color 0.15s;

	&:hover {
		background: ${({ theme }) => theme.colors.surfaceSolid};
		border-color: ${({ theme }) => theme.colors.primary};
		color: ${({ theme }) => theme.colors.primary};
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
