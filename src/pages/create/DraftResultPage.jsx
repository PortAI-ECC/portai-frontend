import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from '@emotion/styled';
import CreateStepLayout from '../../components/layout/CreateStepLayout';
import Card from '../../components/common/Card';
import Modal from '../../components/common/Modal';
import Button from '../../components/common/Button';
import ProgressOverlay from '../../components/common/ProgressOverlay';
import { useGenerationProgress } from '../../hooks/useGenerationProgress';
import { useDelayedVisible } from '../../hooks/useDelayedVisible';
import Field from '../../components/common/Field';
import Textarea from '../../components/common/Textarea';
import Input from '../../components/common/Input';
import { FullscreenIcon, HashIcon, SwapCardsIcon } from '../../components/common/icons';
import { ROUTES } from '../../constants/routes';
import { useCreateFlowStore } from '../../store/createFlowStore';
import { selectIsLoggedIn, useAuthStore } from '../../store/authStore';
import { getPreferences, updatePreferences } from '../../api/profile';
import {
	createGeneration,
	getGeneration,
	regenerate as regenerateGeneration,
	updateResult,
} from '../../api/generations';
import { isSettled } from '../../api/poll';
import { messageOf } from '../../api/client';

// align-items 를 stretch 로 둬 두 패널의 세로 길이를 맞춘다.
const Columns = styled.div`
	display: grid;
	grid-template-columns: 1fr 1fr;
	gap: 32px;
	align-items: stretch;

	@media (max-width: 1100px) {
		grid-template-columns: 1fr;
	}
`;

// 와이어프레임 7 의 겹친 사각형 스왑 아이콘.
const IconButton = styled.button`
	width: 36px;
	height: 36px;
	display: grid;
	place-items: center;
	border-radius: ${({ theme }) => theme.radii.sm};
	color: ${({ theme }) => theme.colors.text};
	transition: background 0.15s;

	&:hover {
		background: rgba(255, 255, 255, 0.6);
	}
`;

const IconRow = styled.div`
	display: flex;
	align-items: center;
	gap: 16px;
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

const PreferenceSection = styled.div`
	display: flex;
	flex-direction: column;
	gap: 12px;

	& + & {
		margin-top: 28px;
	}
`;

const SectionLabel = styled.h3`
	font-size: 14px;
	font-weight: 700;
	color: ${({ theme }) => theme.colors.textSub};
`;

const ChipRow = styled.div`
	display: flex;
	flex-wrap: wrap;
	gap: 10px;
`;

const Chip = styled.button`
	height: 40px;
	padding: 0 18px;
	border-radius: ${({ theme }) => theme.radii.pill};
	font-size: 13px;
	font-weight: ${({ $active }) => ($active ? 700 : 400)};
	background: ${({ theme, $active }) =>
		$active ? theme.colors.primarySoft : theme.colors.surface};
	border: 1px solid
		${({ theme, $active }) => ($active ? theme.colors.primary : theme.colors.border)};
	color: ${({ theme, $active }) => ($active ? theme.colors.primary : theme.colors.textSub)};
`;

const KeywordForm = styled.form`
	display: flex;
	gap: 12px;
`;

const KeywordChip = styled.span`
	display: inline-flex;
	align-items: center;
	gap: 8px;
	height: 36px;
	padding: 0 8px 0 16px;
	border-radius: ${({ theme }) => theme.radii.pill};
	font-size: 13px;
	background: ${({ theme }) => theme.colors.primarySoft};
	color: ${({ theme }) => theme.colors.primary};
`;

const RemoveKeywordButton = styled.button`
	width: 22px;
	height: 22px;
	border-radius: 50%;
	font-size: 13px;
	line-height: 1;
	color: ${({ theme }) => theme.colors.primary};

	&:hover {
		background: rgba(123, 63, 242, 0.16);
	}
`;

const EmptyKeywords = styled.p`
	font-size: 13px;
	color: ${({ theme }) => theme.colors.textMuted};
`;

const ErrorText = styled.p`
	margin-bottom: 16px;
	font-size: 13px;
	color: ${({ theme }) => theme.colors.danger};
`;

// 편집 영역은 결과물 종류와 1:1 이어야 한다. 수동 수정이
// PATCH /api/generations/{id}/results/{type} 로 나가기 때문에,
// key 를 DB 명세서 generation_results.type ENUM 그대로 쓴다.
const SECTIONS = [
	{ key: 'SELF_INTRODUCTION', label: '자기소개' },
	{ key: 'RESUME', label: '이력서' },
	{ key: 'PORTFOLIO', label: '포트폴리오' },
	{ key: 'PROJECT_INTRO', label: '프로젝트 소개' },
	{ key: 'INTERVIEW_QUESTIONS', label: '예상 면접 질문' },
];

const emptyDrafts = () => Object.fromEntries(SECTIONS.map(({ key }) => [key, '']));

const draftsFrom = (generation) => {
	const drafts = emptyDrafts();
	(generation?.results ?? []).forEach((result) => {
		if (result.type in drafts) drafts[result.type] = result.content ?? '';
	});
	return drafts;
};

const TEMPLATES = [
	{ id: 'template-1', name: '템플릿 1' },
	{ id: 'template-2', name: '템플릿 2' },
	{ id: 'template-3', name: '템플릿 3' },
];

// DB 명세서 preferences.style ENUM 순서 그대로.
const STYLE_OPTIONS = [
	{ value: 'CONCISE', label: '간결하게' },
	{ value: 'JUNIOR_DEVELOPER', label: '주니어 개발자' },
	{ value: 'DATA_ANALYST', label: '데이터 분석가' },
	{ value: 'RESEARCHER', label: '연구자' },
	{ value: 'STARTUP_STYLE', label: '스타트업' },
	{ value: 'ENTERPRISE', label: '엔터프라이즈' },
];

// excluded_items.item_type 과 같은 값 집합이라 그대로 재사용한다.
const EMPHASIZED_TYPE_OPTIONS = [
	{ value: 'PROJECT', label: '프로젝트' },
	{ value: 'ACTIVITY', label: '활동이력' },
	{ value: 'CONTEST', label: '공모전' },
	{ value: 'CAREER', label: '인턴/경력' },
];

function DraftResultPage() {
	const navigate = useNavigate();
	const isLoggedIn = useAuthStore(selectIsLoggedIn);
	const templateId = useCreateFlowStore((state) => state.templateId);
	const setTemplateId = useCreateFlowStore((state) => state.setTemplateId);
	const preferences = useCreateFlowStore((state) => state.preferences);
	const setPreferences = useCreateFlowStore((state) => state.setPreferences);
	const addPreferenceKeyword = useCreateFlowStore((state) => state.addPreferenceKeyword);
	const removePreferenceKeyword = useCreateFlowStore((state) => state.removePreferenceKeyword);
	const toggleEmphasizedType = useCreateFlowStore((state) => state.toggleEmphasizedType);
	const jobPostingId = useCreateFlowStore((state) => state.jobPostingId);
	const generationId = useCreateFlowStore((state) => state.generationId);
	const setGenerationId = useCreateFlowStore((state) => state.setGenerationId);

	const [drafts, setDrafts] = useState(emptyDrafts);
	// 서버에 저장돼 있는 값. 편집칸을 벗어날 때 이 값과 다를 때만 PATCH 를 보낸다.
	const savedDraftsRef = useRef(emptyDrafts());
	const [draftError, setDraftError] = useState('');
	// 채용 공고 단계에서 넘어오면 맞춤화 설정부터 고르게 하고, 그걸 닫으면 바로 이어서
	// 템플릿 선택으로 넘어간다. 한 번 다 닫은 뒤에는 헤더의 아이콘으로 각각 다시 연다.
	const [preferencesModalOpen, setPreferencesModalOpen] = useState(() => templateId === null);
	const [templateModalOpen, setTemplateModalOpen] = useState(false);
	// 최초 진입 때 체이닝으로 뜬 템플릿 모달은 템플릿을 골라야만 닫힌다(X 없음).
	// 헤더의 '템플릿 변경' 아이콘으로 다시 연 경우에만 자유롭게 닫을 수 있다.
	const [templateModalDismissible, setTemplateModalDismissible] = useState(false);
	const [fullscreenOpen, setFullscreenOpen] = useState(false);
	const [keywordInput, setKeywordInput] = useState('');
	const [preferencesLoading, setPreferencesLoading] = useState(isLoggedIn);
	const [preferencesError, setPreferencesError] = useState('');
	const progress = useGenerationProgress();
	// 요청이 빨리 끝나면 로딩 화면을 아예 띄우지 않는다. 화면/단계가 아니라
	// 실제로 걸린 시간(400ms)으로만 판단하고, 한 번 뜨면 500ms는 유지해 깜빡임을 막는다.
	const showProgressOverlay = useDelayedVisible(progress.running);

	// 이미 만들어 둔 결과가 있으면(미리보기에서 되돌아왔거나 마이페이지에서 열었을 때)
	// 편집칸을 서버 내용으로 채운다.
	useEffect(() => {
		if (!isLoggedIn || generationId === null) return;

		let cancelled = false;

		getGeneration(generationId)
			.then((generation) => {
				if (cancelled) return;
				const loaded = draftsFrom(generation);
				savedDraftsRef.current = loaded;
				setDrafts(loaded);
			})
			.catch(() => {
				if (!cancelled) setDraftError('이전 결과물을 불러오지 못했어요.');
			});

		return () => {
			cancelled = true;
		};
	}, [isLoggedIn, generationId]);

	// 로그인 상태면 기존 맞춤화 설정을 서버에서 로드한다.
	useEffect(() => {
		if (!isLoggedIn) return;

		getPreferences()
			.then((data) => {
				if (data.keywords || data.emphasizedTypes || data.style) {
					setPreferences({
						keywords: data.keywords ?? [],
						emphasizedTypes: data.emphasizedTypes ?? [],
						style: data.style ?? '',
					});
				}
			})
			.catch(() => setPreferencesError('맞춤화 설정을 불러오지 못했어요. 기본값으로 진행합니다.'))
			.finally(() => setPreferencesLoading(false));
	}, [isLoggedIn, setPreferences]);

	const handleDraftChange = (key) => (event) => {
		setDrafts((prev) => ({ ...prev, [key]: event.target.value }));
	};

	// 편집칸을 벗어날 때 바뀐 항목만 저장한다. 저장된 항목은 edited 로 표시돼
	// 재생성해도 덮어쓰이지 않는다.
	const handleDraftBlur = (key) => async () => {
		if (!isLoggedIn || generationId === null) return;
		if (drafts[key] === savedDraftsRef.current[key]) return;

		try {
			await updateResult(generationId, key, { content: drafts[key] });
			savedDraftsRef.current = { ...savedDraftsRef.current, [key]: drafts[key] };
			setDraftError('');
		} catch (requestError) {
			setDraftError(messageOf(requestError, '수정한 내용을 저장하지 못했어요.'));
		}
	};

	const applyGeneration = (generation) => {
		if (!generation) return;

		const loaded = draftsFrom(generation);
		savedDraftsRef.current = loaded;
		setDrafts(loaded);

		if (generation.overallStatus === 'FAILED') {
			setDraftError('결과물을 만들지 못했어요. 다시 시도해 주세요.');
		} else if (generation.overallStatus === 'PARTIALLY_COMPLETED') {
			setDraftError('일부 항목을 만들지 못했어요. 재생성을 눌러 다시 시도할 수 있어요.');
		}
	};

	const handleGenerate = async () => {
		// 비로그인 상태에서는 보낼 곳이 없어 지금까지처럼 미리보기로만 넘어간다.
		if (!isLoggedIn) {
			navigate(ROUTES.CREATE_PREVIEW);
			return;
		}

		const generation = await progress.track(async () => {
			const accepted = await createGeneration({
				jobPostingId,
				style: preferences.style || undefined,
			});
			setGenerationId(accepted.generationId);
			return accepted.generationId;
		});

		if (!generation) return;

		applyGeneration(generation);
		if (isSettled(generation.overallStatus) && generation.overallStatus !== 'FAILED') {
			navigate(ROUTES.CREATE_PREVIEW);
		}
	};

	const handleRegenerate = async () => {
		if (generationId === null) return;

		const generation = await progress.track(async () => {
			await regenerateGeneration(generationId);
			return generationId;
		});

		applyGeneration(generation);
	};

	// 처음 들어온 흐름(템플릿 미선택)일 때만 템플릿 선택으로 이어진다.
	// 헤더 아이콘으로 재설정을 열었을 때는 닫아도 템플릿 모달이 따라 뜨지 않는다.
	const handleClosePreferences = async () => {
		if (isLoggedIn) {
			try {
				await updatePreferences({
					keywords: preferences.keywords,
					style: preferences.style,
				});
			} catch (requestError) {
				setPreferencesError(messageOf(requestError, '맞춤화 설정 저장에 실패했어요.'));
				return;
			}
		}

		setPreferencesError('');
		setPreferencesModalOpen(false);
		if (templateId === null) setTemplateModalOpen(true);
	};

	const handleAddKeyword = (event) => {
		event.preventDefault();
		const value = keywordInput.trim();
		if (!value) return;
		addPreferenceKeyword(value);
		setKeywordInput('');
	};

	return (
		<CreateStepLayout
			step={4}
			title="임시 결과"
			backTo={ROUTES.CREATE_JOB}
			footer={
				<Button size="lg" onClick={handleGenerate} disabled={progress.running}>
					생성하기
				</Button>
			}
		>
			<Columns>
				<Card>
					<PanelHead>
						<PanelTitle>텍스트 수정</PanelTitle>
						{generationId !== null && (
							<Button
								variant="secondary"
								size="sm"
								onClick={handleRegenerate}
								disabled={progress.running}
							>
								재생성
							</Button>
						)}
					</PanelHead>

					{(draftError || progress.error) && (
						<ErrorText role="alert">{draftError || progress.error}</ErrorText>
					)}

					<Fields>
						{SECTIONS.map(({ key, label }) => (
							<Field key={key} label={label} htmlFor={key}>
								<Textarea
									id={key}
									value={drafts[key]}
									onChange={handleDraftChange(key)}
									onBlur={handleDraftBlur(key)}
									placeholder={`AI가 생성한 ${label} 초안이 여기에 표시됩니다.`}
								/>
							</Field>
						))}
					</Fields>
				</Card>

				<Card>
					<PanelHead>
						<PanelTitle>임시 결과 사이트 미리보기</PanelTitle>
						<IconRow>
							<IconButton
								type="button"
								onClick={() => setPreferencesModalOpen(true)}
								aria-label="맞춤화 설정 다시 열기"
								title="맞춤화 설정 다시 열기"
							>
								<HashIcon />
							</IconButton>
							<IconButton
								type="button"
								onClick={() => {
									setTemplateModalDismissible(true);
									setTemplateModalOpen(true);
								}}
								aria-label="템플릿 변경"
								title="템플릿 변경"
							>
								<SwapCardsIcon />
							</IconButton>
							<IconButton
								type="button"
								onClick={() => setFullscreenOpen(true)}
								aria-label="전체화면 미리보기"
								title="전체화면 미리보기"
							>
								<FullscreenIcon />
							</IconButton>
						</IconRow>
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
				open={preferencesModalOpen}
				onClose={handleClosePreferences}
				title="맞춤화 설정"
			>
				{preferencesError && <ErrorText role="alert">{preferencesError}</ErrorText>}

				<PreferenceSection>
					<SectionLabel>키워드</SectionLabel>
					<KeywordForm onSubmit={handleAddKeyword}>
						<Input
							value={keywordInput}
							onChange={(event) => setKeywordInput(event.target.value)}
							placeholder="자기소개에 강조할 키워드를 입력하세요"
							aria-label="키워드 입력"
							disabled={preferencesLoading}
						/>
						<Button type="submit" disabled={!keywordInput.trim() || preferencesLoading}>
							추가
						</Button>
					</KeywordForm>
					{preferences.keywords.length === 0 ? (
						<EmptyKeywords>아직 추가한 키워드가 없어요.</EmptyKeywords>
					) : (
						<ChipRow>
							{preferences.keywords.map((keyword) => (
								<KeywordChip key={keyword}>
									{keyword}
									<RemoveKeywordButton
										type="button"
										onClick={() => removePreferenceKeyword(keyword)}
										aria-label={`${keyword} 키워드 삭제`}
									>
										✕
									</RemoveKeywordButton>
								</KeywordChip>
							))}
						</ChipRow>
					)}
				</PreferenceSection>

				<PreferenceSection>
					<SectionLabel>강조할 항목</SectionLabel>
					<ChipRow>
						{EMPHASIZED_TYPE_OPTIONS.map((option) => (
							<Chip
								key={option.value}
								type="button"
								$active={preferences.emphasizedTypes.includes(option.value)}
								onClick={() => toggleEmphasizedType(option.value)}
								disabled={preferencesLoading}
							>
								{option.label}
							</Chip>
						))}
					</ChipRow>
				</PreferenceSection>

				<PreferenceSection>
					<SectionLabel>문체</SectionLabel>
					<ChipRow>
						{STYLE_OPTIONS.map((option) => (
							<Chip
								key={option.value}
								type="button"
								$active={preferences.style === option.value}
								onClick={() =>
									setPreferences({
										style: preferences.style === option.value ? '' : option.value,
									})
								}
								disabled={preferencesLoading}
							>
								{option.label}
							</Chip>
						))}
					</ChipRow>
				</PreferenceSection>

				<ModalFooter>
					<Button
						disabled={!preferences.style || preferencesLoading}
						onClick={handleClosePreferences}
					>
						{preferencesLoading ? '저장 중...' : '선택 완료'}
					</Button>
				</ModalFooter>
			</Modal>

			<Modal
				open={templateModalOpen}
				onClose={() => setTemplateModalOpen(false)}
				title="템플릿을 선택하세요"
				dismissible={templateModalDismissible}
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

			{/* 09.최종 결과물 미리보기와 목적이 같은 '전체화면' 확인이라, 모달 폭도
			    그에 맞춰 화면 대부분을 채운다. */}
			<Modal
				open={fullscreenOpen}
				onClose={() => setFullscreenOpen(false)}
				title="임시 결과 사이트 미리보기 (전체화면)"
				width="94vw"
			>
				<Preview>
					<Block $height="160px" />
					<BlockRow>
						<Block $height="240px" />
						<Block $height="240px" />
					</BlockRow>
					<Block $height="300px" />
					<Block $height="240px" />
				</Preview>
			</Modal>

			<ProgressOverlay
				open={showProgressOverlay}
				value={progress.value}
				message={progress.message}
			/>
		</CreateStepLayout>
	);
}

export default DraftResultPage;
