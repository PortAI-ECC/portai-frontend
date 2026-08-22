import { useId, useRef, useState } from 'react';
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
import { visuallyHidden } from '../../styles/controlStyle';

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

	/* 감춰 둔 입력이 탭으로 포커스를 받으면 이 상자에 테두리를 그려 준다. */
	&:focus-within {
		outline: 2px solid ${({ theme }) => theme.colors.primary};
		outline-offset: 2px;
	}
`;

const HiddenInput = styled.input`
	${visuallyHidden}
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

// pollUntil 기본값(90초)은 AI가 채용공고를 읽고 요약하는 작업엔 짧다.
// 결과물 생성(useGenerationProgress.js)과 같은 값으로 맞춰 둔다.
const ANALYSIS_TIMEOUT = 5 * 60 * 1000;

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
	const jobPostingId = useCreateFlowStore((state) => state.jobPostingId);
	const setJobPostingId = useCreateFlowStore((state) => state.setJobPostingId);

	// File 객체는 직렬화가 안 돼 store 에 못 넣는다. 업로드에 쓸 실물은 여기 붙잡아 둔다.
	const [file, setFile] = useState(null);
	const [analyzing, setAnalyzing] = useState(false);
	const [error, setError] = useState('');
	// 분석은 서버가 접수만 하고 나중에 끝나 몇 초씩 걸린다. 얼마나 남았는지는
	// 알 수 없어 진행바 대신 공용 로딩 모달을 쓴다.
	const showLoading = useDelayedVisible(analyzing);

	// 탭과 그 아래 입력칸을 서로 가리키게 해서, 화면을 못 보는 사람에게도
	// '이 탭이 저 입력칸을 연다'가 전달되게 한다.
	const baseId = useId();
	const panelId = `${baseId}-panel`;
	const tabId = (key) => `${baseId}-tab-${key}`;
	const tabRefs = useRef([]);

	// 탭 묶음 안에서는 Tab 이 아니라 화살표로 움직이는 게 표준 동작이다.
	const handleTabKeyDown = (event, index) => {
		const moves = {
			ArrowRight: index + 1,
			ArrowLeft: index - 1,
			Home: 0,
			End: MODES.length - 1,
		};
		const next = moves[event.key];
		if (next === undefined) return;

		event.preventDefault();
		// 양 끝에서는 반대편으로 돌아간다.
		const target = (next + MODES.length) % MODES.length;
		setJobPosting({ mode: MODES[target].key });
		tabRefs.current[target]?.focus();
	};

	// 선택한 방식에 실제 입력이 있을 때만 '분석 후 다음'으로 바뀐다.
	const hasInput = Boolean(
		{
			url: jobPosting.url.trim(),
			text: jobPosting.text.trim(),
			file: jobPosting.fileName,
		}[jobPosting.mode],
	);

	// 파일 모드는 이름만 store 에 남고 실물은 남지 않는다. 뒤로 왔다가 다시
	// 들어오거나 새로고침하면 이름만 있는 상태가 되는데, 그대로 보내면
	// 빈 업로드가 나간다.
	const missingFile = jobPosting.mode === 'file' && Boolean(jobPosting.fileName) && !file;
	// 다만 다시 고르라고 붙잡을 이유가 있는 건 '올려야 하는데 올릴 게 없는' 경우뿐이다.
	// 이미 분석을 마쳤으면(jobPostingId 있음) 다시 올릴 필요가 없고,
	// 비로그인은 어차피 분석 단계가 없어 그냥 지나가면 된다.
	const needsRepick = isLoggedIn && missingFile && jobPostingId === null;

	// 명세서에 있는 분석 엔드포인트는 URL 과 PDF 두 가지뿐이다.
	// 텍스트 붙여넣기는 보낼 곳이 없어 입력값만 들고 다음 단계로 넘어간다.
	const canAnalyze = isLoggedIn && hasInput && jobPosting.mode !== 'text' && !missingFile;

	const handleNext = async () => {
		if (needsRepick) {
			setError('고른 파일이 유지되지 않았어요. 파일을 다시 선택해 주세요.');
			return;
		}

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
					: await analyzeByFile(file);

			// 응답 식별자는 jobPostingId 가 아니라 id 다(명세서와 실물이 달라 둘 다 받는다).
			const id = accepted.id ?? accepted.jobPostingId;
			setJobPostingId(id);

			// 분석은 접수(PENDING)만 먼저 오고 결과는 나중에 채워진다.
			// pollUntil 기본 타임아웃(90초)은 AI가 채용공고를 읽고 요약하는
			// 작업엔 짧다. 결과물 생성과 같은 값으로 맞춰 뒀다 — 백엔드에
			// 실제 소요 시간을 확인하면 그 값에 맞춘다.
			const finished = await pollUntil(
				() => getJobPosting(id),
				(data) => isSettled(data.status),
				{ timeout: ANALYSIS_TIMEOUT },
			);

			if (finished.status === 'FAILED') {
				setError(
					finished.failReason ?? '채용 공고를 분석하지 못했어요. 다시 시도해 주세요.',
				);
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
					{analyzing
						? '분석 중...'
						: canAnalyze
							? '분석 후 다음'
							: hasInput
								? '다음'
								: '건너뛰기'}
				</Button>
			}
		>
			<LoadingOverlay open={showLoading} message="채용 공고를 읽고 있어요" />

			<Tabs role="tablist" aria-label="채용 공고 입력 방식">
				{MODES.map(({ key, label }, index) => {
					const selected = jobPosting.mode === key;

					return (
						<Tab
							key={key}
							type="button"
							role="tab"
							id={tabId(key)}
							aria-selected={selected}
							aria-controls={panelId}
							// 탭 묶음은 통째로 한 정거장이다. 안에서 고르는 건
							// 화살표 키가 하고, Tab 은 다음 요소로 넘어간다.
							tabIndex={selected ? 0 : -1}
							ref={(node) => {
								tabRefs.current[index] = node;
							}}
							$active={selected}
							onClick={() => setJobPosting({ mode: key })}
							onKeyDown={(event) => handleTabKeyDown(event, index)}
						>
							{label}
						</Tab>
					);
				})}
			</Tabs>

			<div id={panelId} role="tabpanel" aria-labelledby={tabId(jobPosting.mode)}>
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
								const picked = event.target.files?.[0] ?? null;
								setFile(picked);
								setJobPosting({ fileName: picked?.name ?? '' });
								// 파일을 새로 골랐으면 앞서 분석해 둔 결과는 더 이상
								// 이 파일의 것이 아니다.
								setJobPostingId(null);
								setError('');
							}}
						/>
					</DropZone>
				)}
			</div>

			{error && <ErrorText role="alert">{error}</ErrorText>}

			{!error && needsRepick && (
				<HelperText>
					이전에 고른 파일은 이 화면을 벗어나면 유지되지 않아요. 다시 선택해 주세요.
				</HelperText>
			)}

			{!error && missingFile && jobPostingId !== null && (
				<HelperText>이미 분석을 마친 파일이에요. 다시 올리지 않아도 돼요.</HelperText>
			)}

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
