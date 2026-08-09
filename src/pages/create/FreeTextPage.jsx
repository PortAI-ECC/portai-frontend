import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from '@emotion/styled';
import CreateStepLayout from '../../components/layout/CreateStepLayout';
import Textarea from '../../components/common/Textarea';
import Button from '../../components/common/Button';
import AiQuestionCharacter from '../../components/character/AiQuestionCharacter';
import { RECORD_CATEGORIES } from '../../constants/recordCategories';
import { ROUTES } from '../../constants/routes';
import { useCreateFlowStore } from '../../store/createFlowStore';

const Layout = styled.div`
	display: grid;
	grid-template-columns: minmax(0, 900px) 300px;
	gap: 40px;
	justify-content: center;
	align-items: start;

	@media (max-width: 1280px) {
		grid-template-columns: minmax(0, 900px);
	}
`;

// 열린 항목의 입력창을 키우면 아래 분야들이 화면 밖으로 밀리므로,
// 목록 자체에 스크롤을 줘서 '다음' 버튼이 항상 보이게 한다.
const Accordion = styled.div`
	display: flex;
	flex-direction: column;
	gap: 12px;
	max-height: 560px;
	overflow-y: auto;
	padding-right: 8px;

	/* 스크롤바가 파스텔 배경을 해치지 않도록 얇게 */
	&::-webkit-scrollbar {
		width: 8px;
	}
	&::-webkit-scrollbar-thumb {
		background: ${({ theme }) => theme.colors.border};
		border-radius: 999px;
	}
	&::-webkit-scrollbar-track {
		background: transparent;
	}
`;

const Section = styled.section`
	/* 스크롤 컨테이너 안에서 항목이 찌그러지지 않도록 축소를 막는다. */
	flex: none;
	background: ${({ theme }) => theme.colors.surface};
	border: 1px solid ${({ theme }) => theme.colors.border};
	border-radius: ${({ theme }) => theme.radii.lg};
	overflow: hidden;
`;

const Toggle = styled.button`
	width: 100%;
	height: 50px;
	padding: 0 20px;
	display: flex;
	align-items: center;
	justify-content: space-between;
	font-size: 15px;
	font-weight: 700;
`;

const Chevron = styled.span`
	font-size: 14px;
	color: ${({ theme }) => theme.colors.textMuted};
	transform: rotate(${({ $open }) => ($open ? '90deg' : '0deg')});
	transition: transform 0.15s;
`;

const Panel = styled.div`
	padding: 0 20px 20px;
`;

const BigTextarea = styled(Textarea)`
	min-height: 280px;
`;

const HintColumn = styled.div`
	position: sticky;
	top: 32px;
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
	const freeTexts = useCreateFlowStore((state) => state.freeTexts);
	const setFreeText = useCreateFlowStore((state) => state.setFreeText);

	const [openKey, setOpenKey] = useState(RECORD_CATEGORIES[0].key);

	return (
		<CreateStepLayout
			step={2}
			title="자유 텍스트 입력"
			description="분야별 토글을 열어 자유롭게 작성해 주세요"
			align="center"
			footer={
				<>
					<Button size="lg" onClick={() => navigate(ROUTES.CREATE_JOB)}>
						다음
					</Button>
					<Button variant="ghost" onClick={() => navigate(ROUTES.CREATE_JOB)}>
						건너뛰기 →
					</Button>
				</>
			}
		>
			<Layout>
				<Accordion>
					{RECORD_CATEGORIES.map(({ key, label }) => {
						const open = openKey === key;

						return (
							<Section key={key}>
								<Toggle
									type="button"
									aria-expanded={open}
									onClick={() => setOpenKey(open ? null : key)}
								>
									{label}
									<Chevron $open={open}>▸</Chevron>
								</Toggle>

								{open && (
									<Panel>
										<BigTextarea
											placeholder={`${label} 내용을 입력하세요...`}
											value={freeTexts[key]}
											onChange={(event) =>
												setFreeText(key, event.target.value)
											}
											aria-label={`${label} 자유 입력`}
										/>
									</Panel>
								)}
							</Section>
						);
					})}
				</Accordion>

				<HintColumn>
					<AiQuestionCharacter question={openKey ? FALLBACK_QUESTIONS[openKey] : null} />
				</HintColumn>
			</Layout>
		</CreateStepLayout>
	);
}

export default FreeTextPage;
