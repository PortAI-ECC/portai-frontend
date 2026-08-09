import { useNavigate } from 'react-router-dom';
import styled from '@emotion/styled';
import CreateStepLayout from '../../components/layout/CreateStepLayout';
import Input from '../../components/common/Input';
import Textarea from '../../components/common/Textarea';
import Button from '../../components/common/Button';
import { ROUTES } from '../../constants/routes';
import { useCreateFlowStore } from '../../store/createFlowStore';

const Tabs = styled.div`
	display: flex;
	gap: 12px;
	margin-bottom: 32px;
`;

const Tab = styled.button`
	height: 44px;
	padding: 0 24px;
	border-radius: ${({ theme }) => theme.radii.pill};
	font-size: 14px;
	font-weight: ${({ $active }) => ($active ? 700 : 400)};
	background: ${({ theme, $active }) =>
		$active ? theme.colors.primarySoft : theme.colors.surface};
	border: 1px solid
		${({ theme, $active }) => ($active ? theme.colors.primary : theme.colors.border)};
	color: ${({ theme, $active }) => ($active ? theme.colors.primary : theme.colors.textSub)};
`;

const DropZone = styled.label`
	display: grid;
	place-items: center;
	min-height: 140px;
	padding: 24px;
	text-align: center;
	font-size: 14px;
	color: ${({ theme }) => theme.colors.textSub};
	background: ${({ theme }) => theme.colors.surface};
	border: 1px dashed ${({ theme }) => theme.colors.primary};
	border-radius: ${({ theme }) => theme.radii.lg};
	cursor: pointer;
`;

const HiddenInput = styled.input`
	display: none;
`;

const TallTextarea = styled(Textarea)`
	min-height: 340px;
`;

const MODES = [
	{ key: 'url', label: '링크로 입력' },
	{ key: 'text', label: '텍스트 붙여넣기' },
	{ key: 'file', label: '사진/PDF 업로드' },
];

function JobPostingPage() {
	const navigate = useNavigate();
	const jobPosting = useCreateFlowStore((state) => state.jobPosting);
	const setJobPosting = useCreateFlowStore((state) => state.setJobPosting);

	// 선택한 방식에 실제 입력이 있을 때만 '분석 후 다음'으로 바뀐다.
	const hasInput = Boolean(
		{
			url: jobPosting.url.trim(),
			text: jobPosting.text.trim(),
			file: jobPosting.fileName,
		}[jobPosting.mode],
	);

	return (
		<CreateStepLayout
			step={3}
			title="채용 공고 입력 (선택)"
			description="지원하려는 채용 공고를 링크·텍스트·사진/PDF 중 편한 방식으로 입력하세요"
			backTo={ROUTES.CREATE_TEXT}
			footer={
				<Button size="lg" onClick={() => navigate(ROUTES.CREATE_DRAFT)}>
					{hasInput ? '분석 후 다음' : '건너뛰기'}
				</Button>
			}
		>
			<Tabs role="tablist">
				{MODES.map(({ key, label }) => (
					<Tab
						key={key}
						type="button"
						role="tab"
						aria-selected={jobPosting.mode === key}
						$active={jobPosting.mode === key}
						onClick={() => setJobPosting({ mode: key })}
					>
						{label}
					</Tab>
				))}
			</Tabs>

			{jobPosting.mode === 'url' && (
				<Input
					type="url"
					placeholder="https://... 채용 공고 링크를 붙여넣으세요"
					value={jobPosting.url}
					onChange={(event) => setJobPosting({ url: event.target.value })}
					aria-label="채용 공고 링크"
				/>
			)}

			{jobPosting.mode === 'text' && (
				<TallTextarea
					placeholder="채용 공고 내용을 붙여넣으세요..."
					value={jobPosting.text}
					onChange={(event) => setJobPosting({ text: event.target.value })}
					aria-label="채용 공고 본문"
				/>
			)}

			{jobPosting.mode === 'file' && (
				<DropZone>
					<span>
						📎 {jobPosting.fileName || '이미지 또는 PDF 파일을 클릭해서 업로드'}
					</span>
					<HiddenInput
						type="file"
						accept="image/*,application/pdf"
						onChange={(event) =>
							setJobPosting({ fileName: event.target.files?.[0]?.name ?? '' })
						}
					/>
				</DropZone>
			)}
		</CreateStepLayout>
	);
}

export default JobPostingPage;
