import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from '@emotion/styled';
import CreateStepLayout from '../../components/layout/CreateStepLayout';
import Card from '../../components/common/Card';
import Modal from '../../components/common/Modal';
import Button from '../../components/common/Button';
import ProgressOverlay from '../../components/common/ProgressOverlay';
import { useGenerationProgress } from '../../hooks/useGenerationProgress';
import Field from '../../components/common/Field';
import Textarea from '../../components/common/Textarea';
import { ROUTES } from '../../constants/routes';
import { useCreateFlowStore } from '../../store/createFlowStore';

const Columns = styled.div`
	display: grid;
	grid-template-columns: 1fr 1fr;
	gap: 32px;
	align-items: start;

	@media (max-width: 1100px) {
		grid-template-columns: 1fr;
	}
`;

const FooterRight = styled.div`
	width: 100%;
	display: flex;
	justify-content: flex-end;
`;

const PanelHead = styled.div`
	display: flex;
	align-items: center;
	justify-content: space-between;
	gap: 12px;
	margin-bottom: 24px;
`;

const PanelTitle = styled.h2`
	font-size: 17px;
	font-weight: 700;
`;

const Fields = styled.div`
	display: flex;
	flex-direction: column;
	gap: 24px;
`;

const Preview = styled.div`
	display: flex;
	flex-direction: column;
	gap: 16px;
	min-height: 680px;
`;

const Block = styled.div`
	background: ${({ theme }) => theme.colors.surfaceSolid};
	border: 1px solid ${({ theme }) => theme.colors.border};
	border-radius: ${({ theme }) => theme.radii.md};
	height: ${({ $height }) => $height};
`;

const BlockRow = styled.div`
	display: grid;
	grid-template-columns: 1fr 1fr;
	gap: 16px;
`;

const TemplateGrid = styled.div`
	display: grid;
	grid-template-columns: repeat(3, 1fr);
	gap: 24px;
`;

const TemplateCard = styled.button`
	display: flex;
	flex-direction: column;
	gap: 12px;
	text-align: left;
`;

const TemplateThumb = styled.div`
	aspect-ratio: 3 / 4;
	border-radius: ${({ theme }) => theme.radii.md};
	background: ${({ theme }) => theme.gradients.page};
	border: 2px solid
		${({ theme, $selected }) => ($selected ? theme.colors.primary : theme.colors.border)};
`;

const TemplateName = styled.span`
	font-size: 14px;
	font-weight: ${({ $selected }) => ($selected ? 700 : 400)};
`;

const ModalFooter = styled.div`
	display: flex;
	justify-content: flex-end;
	margin-top: 32px;
`;

const SECTIONS = [
	{ key: 'introduction', label: '자기소개' },
	{ key: 'techStack', label: '기술스택' },
	{ key: 'projects', label: '프로젝트 소개' },
	{ key: 'careers', label: '경력/활동' },
];

const TEMPLATES = [
	{ id: 'template-1', name: '템플릿 1' },
	{ id: 'template-2', name: '템플릿 2' },
	{ id: 'template-3', name: '템플릿 3' },
];

function DraftResultPage() {
	const navigate = useNavigate();
	const templateId = useCreateFlowStore((state) => state.templateId);
	const setTemplateId = useCreateFlowStore((state) => state.setTemplateId);

	const [drafts, setDrafts] = useState(() =>
		Object.fromEntries(SECTIONS.map(({ key }) => [key, ''])),
	);
	const [templateModalOpen, setTemplateModalOpen] = useState(false);
	const [fullscreenOpen, setFullscreenOpen] = useState(false);
	const progress = useGenerationProgress(() => navigate(ROUTES.CREATE_PREVIEW));

	const handleDraftChange = (key) => (event) => {
		setDrafts((prev) => ({ ...prev, [key]: event.target.value }));
	};

	return (
		<CreateStepLayout
			step={4}
			title="임시 결과"
			footer={
				<FooterRight>
					<Button size="lg" onClick={progress.start} disabled={progress.running}>
						생성하기
					</Button>
				</FooterRight>
			}
		>
			<Columns>
				<Card>
					<PanelHead>
						<PanelTitle>텍스트 수정</PanelTitle>
					</PanelHead>
					<Fields>
						{SECTIONS.map(({ key, label }) => (
							<Field key={key} label={label} htmlFor={key}>
								<Textarea
									id={key}
									value={drafts[key]}
									onChange={handleDraftChange(key)}
									placeholder={`AI가 생성한 ${label} 초안이 여기에 표시됩니다.`}
								/>
							</Field>
						))}
					</Fields>
				</Card>

				<Card>
					<PanelHead>
						<PanelTitle>임시 결과 사이트 미리보기</PanelTitle>
						<div>
							<Button
								variant="secondary"
								size="sm"
								onClick={() => setTemplateModalOpen(true)}
							>
								템플릿 변경
							</Button>{' '}
							<Button
								variant="secondary"
								size="sm"
								onClick={() => setFullscreenOpen(true)}
								aria-label="전체화면 미리보기"
							>
								⛶
							</Button>
						</div>
					</PanelHead>

					<Preview>
						<Block $height="60px" />
						<BlockRow>
							<Block $height="120px" />
							<Block $height="120px" />
						</BlockRow>
						<Block $height="160px" />
						<Block $height="160px" />
					</Preview>
				</Card>
			</Columns>

			<Modal
				open={templateModalOpen}
				onClose={() => setTemplateModalOpen(false)}
				title="템플릿을 선택하세요"
			>
				<TemplateGrid>
					{TEMPLATES.map((template) => (
						<TemplateCard
							key={template.id}
							type="button"
							onClick={() => setTemplateId(template.id)}
						>
							<TemplateThumb $selected={templateId === template.id} />
							<TemplateName $selected={templateId === template.id}>
								{template.name}
							</TemplateName>
						</TemplateCard>
					))}
				</TemplateGrid>
				<ModalFooter>
					<Button disabled={!templateId} onClick={() => setTemplateModalOpen(false)}>
						선택 완료
					</Button>
				</ModalFooter>
			</Modal>

			<Modal
				open={fullscreenOpen}
				onClose={() => setFullscreenOpen(false)}
				title="임시 결과 사이트 미리보기 (전체화면)"
				width="1160px"
			>
				<Preview>
					<Block $height="90px" />
					<BlockRow>
						<Block $height="160px" />
						<Block $height="160px" />
					</BlockRow>
					<Block $height="200px" />
					<Block $height="160px" />
				</Preview>
			</Modal>

			<ProgressOverlay
				open={progress.running}
				value={progress.value}
				message={progress.message}
			/>
		</CreateStepLayout>
	);
}

export default DraftResultPage;
