import { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from '@emotion/styled';
import CreateStepLayout from '../../components/layout/CreateStepLayout';
import Button from '../../components/common/Button';
import AiQuestionCharacter from '../../components/character/AiQuestionCharacter';
import RecordManagerPanel from '../../components/record/RecordManagerPanel';
import { RECORD_CATEGORIES } from '../../constants/recordCategories';
import { ROUTES } from '../../constants/routes';

// 왼쪽 분류 목록 · 가운데 입력 패널 · 오른쪽 우파.
// 가운데 패널이 예전 아코디언만큼 넓게 쓰도록 양옆 열은 좁게 잡는다.
// 좌우 열 너비가 다르면 가운데 패널이 그 차이의 절반만큼 밀려서
// 제목과 세로선이 어긋난다. 두 열을 같은 너비로 잡아 패널을 정중앙에 둔다.
const Layout = styled.div`
	display: grid;
	grid-template-columns: 200px minmax(0, 1fr) 200px;
	gap: 24px;
	align-items: start;

	@media (max-width: 1100px) {
		grid-template-columns: 140px minmax(0, 1fr);
	}

	@media (max-width: 760px) {
		grid-template-columns: minmax(0, 1fr);
	}
`;

// 배경·테두리 없이 글자만 둔다. 카드가 겹쳐 보이면 번잡해서.
// 열은 대칭을 위해 넓게 잡되, 글자 목록 자체는 예전 폭을 유지한다.
const CategoryList = styled.nav`
	display: flex;
	flex-direction: column;
	gap: 12px;
	max-width: 160px;
	position: sticky;
	top: 24px;
`;

const CategoryButton = styled.button`
	width: 100%;
	padding: 11px 14px;
	text-align: left;
	font-size: 14px;
	font-weight: ${({ $active }) => ($active ? 700 : 500)};
	border-radius: ${({ theme }) => theme.radii.md};
	background: ${({ theme, $active }) => ($active ? theme.colors.primarySoft : 'transparent')};
	color: ${({ theme, $active }) => ($active ? theme.colors.primary : theme.colors.textSub)};
	transition:
		background 0.15s,
		color 0.15s;

	&:hover {
		color: ${({ theme }) => theme.colors.primary};
	}
`;

const Panel = styled.section`
	padding: 24px;
	background: ${({ theme }) => theme.colors.surface};
	border: 1px solid ${({ theme }) => theme.colors.border};
	border-radius: ${({ theme }) => theme.radii.lg};
`;

const PanelTitle = styled.h2`
	font-size: 16px;
	font-weight: 700;
	margin-bottom: 20px;
`;

const CharacterColumn = styled.div`
	align-self: stretch;

	@media (max-width: 1100px) {
		display: none;
	}
`;

// 패널에서 포커스한 입력칸 높이까지 우파가 내려간다.
// 포커스가 풀려도 그 자리에 머물고, 분야를 바꿀 때만 처음 위치로 돌아간다.
// 따라갈 때는 느긋하게, 처음 위치로 돌아올 때는 빠르게.
const MovingCharacter = styled.div`
	transform: translateY(${({ $offset }) => $offset}px);
	transition: transform ${({ $fast }) => ($fast ? '0.25s' : '0.55s')} ease;

	@media (prefers-reduced-motion: reduce) {
		transition: none;
	}
`;

// 분야마다 우파가 던지는 확장 질문. 백엔드의 확장 질문 생성 API 가 붙으면
// 이 표 대신 응답값을 넣는다.
const FALLBACK_QUESTIONS = {
	contests: '공모전에서 어떤 역할을 맡으셨나요?',
	careers: '그 인턴십에서 직접 만든 결과물은 무엇인가요?',
	certificates: '자격증을 딴 이유가 있었나요?',
	education: '교육에서 배운 걸 어디에 써보셨어요?',
	techStacks: '가장 자신 있는 기술은 무엇인가요?',
	activities: '그 활동에서 가장 기억에 남는 순간은요?',
};

function FreeTextPage() {
	const navigate = useNavigate();
	const [activeKey, setActiveKey] = useState(RECORD_CATEGORIES[0].key);
	const [counts, setCounts] = useState({});
	// RecordManagerPanel 은 key={activeKey} 로 분야를 바꿀 때마다 통째로
	// 다시 마운트된다(폼·수정 상태를 새로 시작하려고 일부러 그렇게 뒀다).
	// 그런데 그러면 패널 안에서만 들고 있던 '이번에 고른 기록' 목록도 같이
	// 날아가 버려서, 분야별로 여기서 대신 들고 있다가 initialItems 로 되돌려준다.
	const [itemsByCategory, setItemsByCategory] = useState({});
	const [characterOffset, setCharacterOffset] = useState(0);
	const [fastMove, setFastMove] = useState(false);
	const characterRef = useRef(null);

	const handleChanged = (key, count, items) => {
		setCounts((prev) => ({ ...prev, [key]: count }));
		if (items) setItemsByCategory((prev) => ({ ...prev, [key]: items }));
	};

	// 패널 안에서 포커스가 잡히면 우파를 그 높이로 내린다. 포커스가 빠져도
	// 되돌리지 않아야 해서 blur 는 듣지 않는다.
	const handleFocusCapture = (event) => {
		// 모달은 포털로 띄우지만 리액트 이벤트는 트리를 타고 여기까지 올라온다.
		// 모달 안에서 고르는 동안에는 우파가 움직이면 안 된다.
		if (event.target.closest('[role="dialog"]')) return;

		// 따라갈 대상은 '지금 쓰고 있는 입력칸'뿐이다. 단추까지 따라가면
		// 불러오기를 누르는 순간(과 모달을 닫아 포커스가 되돌아올 때) 우파가
		// 맨 위로 튀어 오른다.
		if (!['INPUT', 'TEXTAREA', 'SELECT'].includes(event.target.tagName)) return;

		const character = characterRef.current;
		if (!character) return;

		// 말풍선이 아니라 우파가 그 칸과 나란해져야 하므로, 지금 우파 위치와의
		// 차이만큼만 더 움직인다.
		const delta =
			event.target.getBoundingClientRect().top - character.getBoundingClientRect().top;

		setFastMove(false);
		setCharacterOffset((previous) => Math.max(0, Math.round(previous + delta)));
	};

	const handleSelectCategory = (key) => {
		setActiveKey(key);
		setFastMove(true);
		setCharacterOffset(0);
	};

	const activeLabel = RECORD_CATEGORIES.find(({ key }) => key === activeKey)?.label;
	const hasAnyRecord = Object.values(counts).some((count) => count > 0);

	return (
		<CreateStepLayout
			step={2}
			title="활동이력 입력"
			description="분야를 골라 활동이력을 등록해 주세요"
			align="center"
			backTo={ROUTES.CREATE_LINKS}
			footer={
				<Button size="lg" onClick={() => navigate(ROUTES.CREATE_JOB)}>
					{hasAnyRecord ? '다음' : '건너뛰기'}
				</Button>
			}
		>
			<Layout>
				<CategoryList aria-label="활동이력 분야">
					{RECORD_CATEGORIES.map(({ key, label }) => (
						<CategoryButton
							key={key}
							type="button"
							$active={key === activeKey}
							aria-current={key === activeKey}
							onClick={() => handleSelectCategory(key)}
						>
							{label}
						</CategoryButton>
					))}
				</CategoryList>

				<Panel onFocusCapture={handleFocusCapture}>
					<PanelTitle>{activeLabel}</PanelTitle>
					{/* key 를 줘야 분야를 바꿀 때 폼·목록 상태가 새로 시작한다. */}
					<RecordManagerPanel
						key={activeKey}
						categoryKey={activeKey}
						title={activeLabel}
						variant="create"
						initialItems={itemsByCategory[activeKey] ?? []}
						onChanged={handleChanged}
					/>
				</Panel>

				<CharacterColumn>
					<MovingCharacter $offset={characterOffset} $fast={fastMove}>
						<AiQuestionCharacter
							question={FALLBACK_QUESTIONS[activeKey]}
							characterRef={characterRef}
						/>
					</MovingCharacter>
				</CharacterColumn>
			</Layout>
		</CreateStepLayout>
	);
}

export default FreeTextPage;
