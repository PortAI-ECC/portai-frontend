import { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from '@emotion/styled';
import CreateStepLayout from '../../components/layout/CreateStepLayout';
import Input from '../../components/common/Input';
import Textarea from '../../components/common/Textarea';
import Button from '../../components/common/Button';
import LoadingOverlay from '../../components/common/LoadingOverlay';
import { useDelayedVisible } from '../../hooks/useDelayedVisible';
import { ROUTES } from '../../constants/routes';
import { useCreateFlowStore } from '../../store/createFlowStore';
import { selectIsLoggedIn, useAuthStore } from '../../store/authStore';
import { analyzeByFile, analyzeByUrl, getJobPosting } from '../../api/jobPostings';
import { isSettled, pollUntil } from '../../api/poll';
import { messageOf } from '../../api/client';

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

const ErrorText = styled.p`
	margin-top: 16px;
	font-size: 13px;
	color: ${({ theme }) => theme.colors.danger};
`;

const HelperText = styled.p`
	margin-top: 16px;
	font-size: 13px;
	color: ${({ theme }) => theme.colors.textMuted};
`;

const MODES = [
	{ key: 'url', label: '링크로 입력' },
	{ key: 'text', label: '텍스트 붙여넣기' },
	{ key: 'file', label: '사진/PDF 업로드' },
];

function JobPostingPage() {
	const navigate = useNavigate();
	const isLoggedIn = useAuthStore(selectIsLoggedIn);
	const jobPosting = useCreateFlowStore((state) => state.jobPosting);
	const setJobPosting = useCreateFlowStore((state) => state.setJobPosting);
	const setJobPostingId = useCreateFlowStore((state) => state.setJobPostingId);

	// File 객체는 직렬화가 안 돼 store 에 못 넣는다. 업로드에 쓸 실물은 여기 붙잡아 둔다.
	const fileRef = useRef(null);
	const [analyzing, setAnalyzing] = useState(false);
	const [error, setError] = useState('');
	// 분석은 서버가 접수만 하고 나중에 끝나 몇 초씩 걸린다. 얼마나 남았는지는
	// 알 수 없어 진행바 대신 공용 로딩 모달을 쓴다.
	const showLoading = useDelayedVisible(analyzing);

	// 선택한 방식에 실제 입력이 있을 때만 '분석 후 다음'으로 바뀐다.
	const hasInput = Boolean(
		{
			url: jobPosting.url.trim(),
			text: jobPosting.text.trim(),
			file: jobPosting.fileName,
		}[jobPosting.mode],
	);

	// 명세서에 있는 분석 엔드포인트는 URL 과 PDF 두 가지뿐이다.
	// 텍스트 붙여넣기는 보낼 곳이 없어 입력값만 들고 다음 단계로 넘어간다.
	const canAnalyze = isLoggedIn && hasInput && jobPosting.mode !== 'text';

	const handleNext = async () => {
		if (!canAnalyze) {
			navigate(ROUTES.CREATE_DRAFT);
			return;
		}

		setError('');
		setAnalyzing(true);

		try {
			const accepted =
				jobPosting.mode === 'url'
					? await analyzeByUrl(jobPosting.url.trim())
					: await analyzeByFile(fileRef.current);

			const id = accepted.jobPostingId;
			setJobPostingId(id);

			// 분석은 접수(PENDING)만 먼저 오고 결과는 나중에 채워진다.
			const finished = await pollUntil(
				() => getJobPosting(id),
				(data) => isSettled(data.status),
			);

			if (finished.status === 'FAILED') {
				setError(finished.failReason ?? '채용 공고를 분석하지 못했어요. 다시 시도해 주세요.');
				return;
			}

			navigate(ROUTES.CREATE_DRAFT);
		} catch (requestError) {
			// 분석이 실패해도 입력한 내용은 남으니 건너뛸 수 있게 안내만 한다.
			setError(
				requestError?.message === 'TIMEOUT'
					? '분석이 오래 걸리고 있어요. 잠시 후 다시 시도해 주세요.'
					: messageOf(requestError, '채용 공고 분석에 실패했어요.'),
			);
		} finally {
			setAnalyzing(false);
		}
	};

	return (
		<CreateStepLayout
			step={3}
			title="채용 공고 입력 (선택)"
			description="지원하려는 채용 공고를 링크·텍스트·사진/PDF 중 편한 방식으로 입력하세요"
			backTo={ROUTES.CREATE_TEXT}
			footer={
				<Button size="lg" onClick={handleNext} disabled={analyzing}>
					{analyzing ? '분석 중...' : canAnalyze ? '분석 후 다음' : hasInput ? '다음' : '건너뛰기'}
				</Button>
			}
		>
			<LoadingOverlay open={showLoading} message="채용 공고를 읽고 있어요" />

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
						onChange={(event) => {
							const file = event.target.files?.[0] ?? null;
							fileRef.current = file;
							setJobPosting({ fileName: file?.name ?? '' });
						}}
					/>
				</DropZone>
			)}

			{error && <ErrorText role="alert">{error}</ErrorText>}

			{!error && jobPosting.mode === 'text' && hasInput && (
				<HelperText>
					텍스트 붙여넣기는 아직 분석 API가 없어 입력한 내용만 다음 단계로 전달돼요.
				</HelperText>
			)}

			{!error && !isLoggedIn && hasInput && (
				<HelperText>로그인하면 채용 공고를 분석해 결과물에 반영할 수 있어요.</HelperText>
			)}
		</CreateStepLayout>
	);
}

export default JobPostingPage;
