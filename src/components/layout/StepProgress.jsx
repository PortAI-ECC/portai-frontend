import styled from '@emotion/styled';
import { CREATE_STEPS } from '../../constants/routes';

const Nav = styled.nav`
	display: grid;
	grid-template-columns: repeat(${CREATE_STEPS.length}, 1fr);
	max-width: 1000px;
	margin: 0 auto 32px;
`;

// 라벨이 점 위에 오도록 [Label, Dot] 순서로 쌓는다.
const Step = styled.div`
	position: relative;
	display: flex;
	flex-direction: column;
	align-items: center;
	gap: 10px;

	/* 마지막 단계를 뺀 각 단계 오른쪽으로 다음 점까지 연결선을 긋는다. */
	&:not(:last-of-type)::after {
		content: '';
		position: absolute;
		bottom: 7px;
		left: calc(50% + 14px);
		width: calc(100% - 28px);
		height: 2px;
		background: ${({ theme, $done }) => ($done ? theme.colors.primary : theme.colors.border)};
	}
`;

const Label = styled.span`
	font-size: 13px;
	font-weight: ${({ $active }) => ($active ? 700 : 400)};
	color: ${({ theme, $active }) => ($active ? theme.colors.text : theme.colors.textMuted)};
	text-align: center;
`;

const Dot = styled.span`
	width: 16px;
	height: 16px;
	border-radius: 50%;
	background: ${({ theme, $active, $done }) =>
		$active || $done ? theme.colors.primary : theme.colors.surfaceSolid};
	border: 2px solid ${({ theme, $done }) => ($done ? theme.colors.primary : theme.colors.border)};
	box-shadow: ${({ theme, $active }) =>
		$active ? `0 0 0 6px ${theme.colors.primarySoft}` : 'none'};
`;

function StepProgress({ current }) {
	return (
		<Nav aria-label="포트폴리오 생성 단계">
			{CREATE_STEPS.map((step, index) => (
				<Step key={step.path} $done={index < current}>
					<Label $active={index === current}>
						{index + 1}. {step.label}
					</Label>
					<Dot $active={index === current} $done={index < current} />
				</Step>
			))}
		</Nav>
	);
}

export default StepProgress;
