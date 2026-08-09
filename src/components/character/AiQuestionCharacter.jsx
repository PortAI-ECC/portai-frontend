import styled from '@emotion/styled';
import AxolotlPixel from './AxolotlPixel';

const Wrapper = styled.aside`
	display: flex;
	flex-direction: column;
	align-items: center;
	gap: 4px;
`;

const Bubble = styled.div`
	position: relative;
	width: 100%;
	padding: 20px;
	background: ${({ theme }) => theme.colors.surfaceSolid};
	border: 1px solid ${({ theme }) => theme.colors.border};
	border-radius: ${({ theme }) => theme.radii.lg};
	box-shadow: ${({ theme }) => theme.shadows.card};

	/* 말풍선 꼬리. 테두리 위에 덮어 그려 선이 이어져 보이게 한다. */
	&::before,
	&::after {
		content: '';
		position: absolute;
		top: 100%;
		left: 50%;
		border: 10px solid transparent;
		border-top-color: ${({ theme }) => theme.colors.border};
		transform: translateX(-50%);
	}

	&::after {
		border-top-color: ${({ theme }) => theme.colors.surfaceSolid};
		margin-top: -1.5px;
	}
`;

const Label = styled.p`
	font-family: ${({ theme }) => theme.font.display};
	font-size: 11px;
	font-weight: 600;
	letter-spacing: 0.14em;
	text-transform: uppercase;
	color: ${({ theme }) => theme.colors.textMuted};
	margin-bottom: 10px;
`;

const Question = styled.p`
	font-size: 14px;
	line-height: 1.6;
	color: ${({ theme }) => theme.colors.text};
`;

const Empty = styled.p`
	font-size: 13px;
	color: ${({ theme }) => theme.colors.textMuted};
`;

/**
 * 자유 텍스트 입력 화면의 AI 추가 질문 담당 캐릭터.
 * 와이어프레임(5. 자유텍스트 입력)의 '우파(픽셀)' 자리를 채운다.
 *
 * 질문이 바뀔 때마다 animationKey 가 바뀌어 세 번 붕붕 뛴다.
 */
function AiQuestionCharacter({ question }) {
	return (
		<Wrapper>
			<Bubble>
				<Label>AI 추가 질문</Label>
				{question ? (
					<Question>“{question}”</Question>
				) : (
					<Empty>내용을 입력하면 우파가 더 물어볼 거예요.</Empty>
				)}
			</Bubble>

			<AxolotlPixel
				size={132}
				motion="bounce"
				animationKey={question ?? 'idle'}
				title="우파 캐릭터"
			/>
		</Wrapper>
	);
}

export default AiQuestionCharacter;
