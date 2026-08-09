import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from '@emotion/styled';
import CreateStepLayout from '../../components/layout/CreateStepLayout';
import Textarea from '../../components/common/Textarea';
import Button from '../../components/common/Button';
import { RECORD_CATEGORIES } from '../../constants/recordCategories';
import { ROUTES } from '../../constants/routes';
import { useCreateFlowStore } from '../../store/createFlowStore';

const Layout = styled.div`
	display: grid;
	grid-template-columns: minmax(0, 820px) 300px;
	gap: 40px;
	justify-content: center;
	align-items: start;

	@media (max-width: 1180px) {
		grid-template-columns: minmax(0, 820px);
	}
`;

const Accordion = styled.div`
	display: flex;
	flex-direction: column;
	gap: 12px;
`;

const Section = styled.section`
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

const Hint = styled.aside`
	padding: 20px;
	background: ${({ theme }) => theme.colors.surfaceSolid};
	border: 1px solid ${({ theme }) => theme.colors.border};
	border-radius: ${({ theme }) => theme.radii.lg};
	position: sticky;
	top: 96px;
`;

const HintTitle = styled.p`
	font-size: 14px;
	font-weight: 700;
	margin-bottom: 8px;
`;

const HintText = styled.p`
	font-size: 14px;
	color: ${({ theme }) => theme.colors.textSub};
`;

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
										<Textarea
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

				<Hint>
					<HintTitle>AI 추가 질문</HintTitle>
					<HintText>“공모전에서 어떤 역할을 맡으셨나요?”</HintText>
				</Hint>
			</Layout>
		</CreateStepLayout>
	);
}

export default FreeTextPage;
