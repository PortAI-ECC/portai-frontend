import styled from '@emotion/styled';
import AxolotlPixel from './AxolotlPixel';

// 우파는 왼쪽 아래, 말풍선은 그 오른쪽 위로 뻗는다.
const Wrapper = styled.aside`
	display: flex;
	flex-direction: column;
	align-items: flex-start;
	gap: 12px;
`;

// 말풍선(Bubble)은 position: relative 라 흐름상 뒤에 오는 우파보다 위에 그려진다.
// 튀어 오른 우파가 말풍선에 가리지 않도록 우파 쪽을 한 겹 위로 올린다.
const CharacterSlot = styled.div`
	position: relative;
	z-index: 1;
`;

const Bubble = styled.div`
	position: relative;
	/* 꼬리가 왼쪽 끝(우파 머리 위)에 있고 몸통은 오른쪽으로 뻗는다. */
	width: 100%;
	margin-right: auto;
	padding: 16px 18px;
	background: ${({ theme }) => theme.colors.surfaceSolid};
	border: 1px solid ${({ theme }) => theme.colors.border};
	border-radius: ${({ theme }) => theme.radii.lg};
	box-shadow: ${({ theme }) => theme.shadows.card};

	/* 말풍선 꼬리. 테두리 위에 덮어 그려 선이 이어져 보이게 한다.
	   우파가 왼쪽 아래에 서 있으므로 꼬리도 그쪽을 가리킨다.
	   우파 크기(81px)의 정확한 중심은 40.5px — 꼬리 삼각형은 10px 두께라
	   그 중심에 맞추려면 left 도 정수가 아니라 30.5px 이어야 한다.
	   (우파 크기를 바꾸면 이 값도 size/2 - 10 으로 다시 맞춰야 한다.) */
	&::before,
	&::after {
		content: '';
		position: absolute;
		top: 100%;
		left: 30.5px;
		border: 10px solid transparent;
		border-top-color: ${({ theme }) => theme.colors.border};
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
	/* 한국어는 글자 단위로 끊지 말고 어절째 넘긴다. */
	word-break: keep-all;
	overflow-wrap: break-word;
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
function AiQuestionCharacter({ question, characterRef }) {
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

			{/* 우파를 기준으로 위치를 맞추는 쪽(FreeTextPage)이 이 자리를 잰다. */}
			<CharacterSlot ref={characterRef}>
				{/* 27칸 그리드라 한 칸이 딱 3px 이 되는 81px 로 둔다(104px 의 약 80%).
				    나누어떨어지지 않는 값을 쓰면 도트 경계가 흐려진다. */}
				<AxolotlPixel
					size={81}
					motion="bounce"
					animationKey={question ?? 'idle'}
					title="우파 캐릭터"
				/>
			</CharacterSlot>
		</Wrapper>
	);
}

export default AiQuestionCharacter;
