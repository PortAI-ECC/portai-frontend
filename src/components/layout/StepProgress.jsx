import { useNavigate } from 'react-router-dom';
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
	transition: transform 0.15s;
`;

// 지나온 단계는 점을 눌러 되돌아갈 수 있다. 아직 안 온 단계는 누를 수 없다.
// Emotion 컴포넌트 셀렉터는 babel 플러그인이 있어야 해서 클래스로 짚는다.
const StepButton = styled.button`
	display: flex;
	flex-direction: column;
	align-items: center;
	gap: 10px;
	cursor: ${({ $clickable }) => ($clickable ? 'pointer' : 'default')};

	&:hover .step-dot {
		transform: ${({ $clickable }) => ($clickable ? 'scale(1.25)' : 'none')};
	}
`;

function StepProgress({ current }) {
	const navigate = useNavigate();

	return (
		<Nav aria-label="포트폴리오 생성 단계">
			{CREATE_STEPS.map((step, index) => {
				const done = index < current;
				const active = index === current;

				return (
					<Step key={step.path} $done={done}>
						<StepButton
							type="button"
							$clickable={done}
							disabled={!done}
							aria-current={active ? 'step' : undefined}
							aria-label={`${index + 1}. ${step.label}${done ? ' (이 단계로 돌아가기)' : ''}`}
							onClick={() => done && navigate(step.path)}
						>
							<Label $active={active}>
								{index + 1}. {step.label}
							</Label>
							<Dot className="step-dot" $active={active} $done={done} />
						</StepButton>
					</Step>
				);
			})}
		</Nav>
	);
}

export default StepProgress;
