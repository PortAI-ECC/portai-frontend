import { useEffect, useRef, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
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
import PortfolioPreview from '../../components/result/PortfolioPreview';
import { PORTFOLIO_TEMPLATE_LIST, normalizeTemplateId } from '../../components/result/templates';
import { TEMPLATE_SWATCH } from '../../components/result/templates/swatches';
import { usePortfolioTemplateData } from '../../hooks/usePortfolioTemplateData';
import { RESULT_SECTIONS } from '../../constants/resultTypes';
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
import { messageOf } from '../../api/client';

// 템플릿이 6종이라 한 화면에 3개씩 나눠 보여주고 화살표로 넘긴다.
const TEMPLATES_PER_PAGE = 3;
const TEMPLATE_PAGE_COUNT = Math.ceil(PORTFOLIO_TEMPLATE_LIST.length / TEMPLATES_PER_PAGE);

const TEMPLATE_PAGES = Array.from({ length: TEMPLATE_PAGE_COUNT }, (_, page) =>
	PORTFOLIO_TEMPLATE_LIST.slice(page * TEMPLATES_PER_PAGE, (page + 1) * TEMPLATES_PER_PAGE),
);

// 모달을 열 때 지금 골라 둔 템플릿이 있는 페이지부터 보여준다.
const pageOfTemplate = (id) => {
	const index = PORTFOLIO_TEMPLATE_LIST.findIndex(
		(template) => template.id === normalizeTemplateId(id),
	);
	return index < 0 ? 0 : Math.floor(index / TEMPLATES_PER_PAGE);
};

// align-items 를 stretch 로 둬 두 패널의 세로 길이를 맞춘다.
//
// minmax(0, 1fr) 이어야 한다. 1fr 의 최솟값은 auto 라서, 미리보기 패널 안의
// 축소 전 템플릿(고정 1100px)이 그대로 최소 너비로 잡히면 오른쪽 칸이 부풀어
// 왼쪽 편집칸을 100px 대로 짜부라뜨린다(축소 배율도 그 너비를 보고 정해지므로
// 한번 밀리면 되돌아오지 않는다).
const Columns = styled.div`
	display: grid;
	grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
	gap: 32px;
	align-items: stretch;

	@media (max-width: 1100px) {
		grid-template-columns: minmax(0, 1fr);
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

// 편집칸 4개에 자유텍스트 분류별 초안까지 이어지므로 목록 자체에 스크롤을 준다
// (FreeTextPage 의 Accordion 과 같은 방식). 스크롤은 맨 위 '자기소개'부터 맨 끝까지
// 하나로 걸리고, 높이를 오른쪽 미리보기 패널과 맞춰 두 패널의 절반 분할을 유지한다.
const Fields = styled.div`
	display: flex;
	flex-direction: column;
	gap: 24px;
	max-height: 680px;
	overflow-y: auto;
	padding-right: 8px;

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

const Preview = styled.div`
	border-radius: ${({ theme }) => theme.radii.lg};
	overflow: hidden;
`;

// 템플릿이 6종으로 늘었어도 모달 디자인은 그대로 두고, 화살표로 3개씩 넘긴다.
const TemplatePager = styled.div`
	display: flex;
	align-items: center;
	gap: 16px;
`;

const PagerButton = styled.button`
	flex: none;
	width: 36px;
	height: 36px;
	display: grid;
	place-items: center;
	border-radius: 50%;
	font-size: 15px;
	line-height: 1;
	color: ${({ theme }) => theme.colors.textSub};
	background: ${({ theme }) => theme.colors.surface};
	border: 1px solid ${({ theme }) => theme.colors.border};
	transition: all 0.15s;

	&:hover:not(:disabled) {
		color: ${({ theme }) => theme.colors.primary};
		border-color: ${({ theme }) => theme.colors.primary};
	}

	&:disabled {
		opacity: 0.35;
		cursor: default;
	}
`;

// 화살표를 누르면 페이지가 옆으로 밀려 들어온다. 6개를 모두 한 줄에 두고
// 트랙을 통째로 옮기는 방식이라, 넘어가는 도중에도 양쪽 페이지가 같이 보인다.
const TemplateViewport = styled.div`
	flex: 1;
	min-width: 0;
	overflow: hidden;
`;

const TemplateTrack = styled.div`
	display: flex;
	transform: translateX(${({ $page }) => `-${$page * 100}%`});
	transition: transform 0.34s cubic-bezier(0.22, 0.61, 0.36, 1);

	/* 모션을 꺼 둔 사용자에게는 즉시 전환한다. */
	@media (prefers-reduced-motion: reduce) {
		transition: none;
	}
`;

const TemplatePage = styled.div`
	flex: 0 0 100%;
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

// 선택 표시는 템플릿이 자리표시자였을 때 썸네일에 깔려 있던 파스텔 메시
// 그라데이션을 되살린 것. 테두리 자리(border-box)에만 그라데이션을 깔고 안쪽
// (padding-box)은 템플릿 고유 색으로 덮어 그라데이션 테두리를 만든다.
const SELECTED_GRADIENT = ({ theme }) => `linear-gradient(135deg,
	${theme.colors.primary} 0%,
	#C86DD7 38%,
	${theme.colors.pink} 68%,
	${theme.colors.periwinkle} 100%)`;

// 실제 템플릿을 축소 렌더하는 대신 대표 색만 막대로 보여준다(원래 모달 모습).
const TemplateThumb = styled.div`
	aspect-ratio: 3 / 4;
	display: flex;
	flex-direction: column;
	gap: 8px;
	padding: 14px;
	border-radius: ${({ theme }) => theme.radii.md};
	border: 3px solid transparent;
	background:
		linear-gradient(${({ $swatch }) => `${$swatch.bg}, ${$swatch.bg}`}) padding-box,
		${(props) =>
			props.$selected
				? SELECTED_GRADIENT(props)
				: `linear-gradient(${props.theme.colors.border}, ${props.theme.colors.border})`}
			border-box;
	box-shadow: ${({ $selected }) =>
		$selected
			? '0 0 0 4px rgba(123, 63, 242, 0.14), 0 10px 28px rgba(123, 63, 242, 0.24)'
			: 'none'};
	transition:
		box-shadow 0.2s,
		transform 0.2s;

	${TemplateCard}:hover & {
		transform: translateY(-2px);
	}
`;

const ThumbBar = styled.div`
	height: ${({ $height }) => $height};
	border-radius: ${({ $swatch }) => $swatch.radius};
	background: ${({ $swatch, $accent }) => ($accent ? $swatch.accent : $swatch.accentSoft)};
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
// key 는 DB 명세서 generation_results.type ENUM 그대로다.
const emptyDrafts = () => Object.fromEntries(RESULT_SECTIONS.map(({ key }) => [key, '']));

const draftsFrom = (generation) => {
	const drafts = emptyDrafts();
	(generation?.results ?? []).forEach((result) => {
		if (result.type in drafts) drafts[result.type] = result.content ?? '';
	});
	return drafts;
};

// DB 명세서 preferences.style ENUM 순서 그대로.
const STYLE_OPTIONS = [
	{ value: 'CONCISE', label: '간결하게' },
	{ value: 'JUNIOR_DEVELOPER', label: '주니어 개발자' },
	{ value: 'DATA_ANALYST', label: '데이터 분석가' },
	{ value: 'RESEARCHER', label: '연구자' },
	{ value: 'STARTUP', label: '스타트업' },
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
	const entryMode = useCreateFlowStore((state) => state.entryMode);

	// 마이페이지에서 열면 /create/draft?id=123 으로 들어온다. 주소에 있는 쪽이
	// 항상 옳으므로(새로고침해도 같은 결과물이 열려야 한다) 스토어를 여기에 맞춘다.
	const [searchParams] = useSearchParams();
	const requestedId = Number(searchParams.get('id')) || null;

	useEffect(() => {
		if (requestedId !== null && requestedId !== generationId) setGenerationId(requestedId);
	}, [requestedId, generationId, setGenerationId]);

	const [drafts, setDrafts] = useState(emptyDrafts);
	// 미리보기(오른쪽 패널·전체화면)는 편집칸이 아니라 서버 응답 원본을 그린다.
	const [generation, setGeneration] = useState(null);
	// 서버에 저장돼 있는 값. 편집칸을 벗어날 때 이 값과 다를 때만 PATCH 를 보낸다.
	const savedDraftsRef = useRef(emptyDrafts());
	const [draftError, setDraftError] = useState('');
	// 채용 공고 단계에서 넘어오면 맞춤화 설정부터 고르게 하고, 그걸 닫으면 바로 이어서
	// 템플릿 선택으로 넘어간다. 한 번 다 닫은 뒤에는 헤더의 아이콘으로 각각 다시 연다.
	//
	// 다만 마이페이지에서 기존 포트폴리오를 여는 길(entryMode='manage')은 이미 골라 둔
	// 결과를 다시 보러 온 것이라, 설정을 처음부터 다시 묻지 않는다.
	const [preferencesModalOpen, setPreferencesModalOpen] = useState(
		() => templateId === null && entryMode !== 'manage',
	);
	const [templateModalOpen, setTemplateModalOpen] = useState(false);
	// 최초 진입 때 체이닝으로 뜬 템플릿 모달은 템플릿을 골라야만 닫힌다(X 없음).
	// 헤더의 '템플릿 변경' 아이콘으로 다시 연 경우에만 자유롭게 닫을 수 있다.
	const [templateModalDismissible, setTemplateModalDismissible] = useState(false);
	const [templatePage, setTemplatePage] = useState(() => pageOfTemplate(templateId));
	const [fullscreenOpen, setFullscreenOpen] = useState(false);
	const [keywordInput, setKeywordInput] = useState('');
	const [preferencesLoading, setPreferencesLoading] = useState(isLoggedIn);
	const [preferencesError, setPreferencesError] = useState('');
	const progress = useGenerationProgress();
	// 요청이 빨리 끝나면 로딩 화면을 아예 띄우지 않는다. 화면/단계가 아니라
	// 실제로 걸린 시간(400ms)으로만 판단하고, 한 번 뜨면 500ms는 유지해 깜빡임을 막는다.
	const showProgressOverlay = useDelayedVisible(progress.running);

	const { data: portfolioData, error: portfolioError } = usePortfolioTemplateData(generation);

	// 이미 만들어 둔 결과가 있으면(미리보기에서 되돌아왔거나 마이페이지에서 열었을 때)
	// 편집칸을 서버 내용으로 채운다.
	useEffect(() => {
		if (!isLoggedIn || generationId === null) return;

		let cancelled = false;

		getGeneration(generationId)
			.then((loadedGeneration) => {
				if (cancelled) return;
				const loaded = draftsFrom(loadedGeneration);
				savedDraftsRef.current = loaded;
				setDrafts(loaded);
				setGeneration(loadedGeneration);
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
			.catch(() =>
				setPreferencesError('맞춤화 설정을 불러오지 못했어요. 기본값으로 진행합니다.'),
			)
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

	const applyGeneration = (result) => {
		if (!result) return;

		const loaded = draftsFrom(result);
		savedDraftsRef.current = loaded;
		setDrafts(loaded);
		setGeneration(result);

		if (result.overallStatus === 'FAILED') {
			setDraftError('결과물을 만들지 못했어요. 다시 시도해 주세요.');
		} else if (result.overallStatus === 'PARTIALLY_COMPLETED') {
			setDraftError('일부 항목을 만들지 못했어요. 재생성을 눌러 다시 시도할 수 있어요.');
		}
	};

	// 맞춤화 설정과 템플릿을 다 고른 뒤에야 그 값을 실어 생성을 요청한다.
	// 여기가 이 위자드에서 가장 오래 걸리는 구간이라, 로딩 화면도 여기서 뜬다.
	// 응답 식별자는 generationId 가 아니라 id 다(명세서와 실물이 달라 둘 다 받는다).
	const acceptedIdOf = (accepted) => accepted?.id ?? accepted?.generationId ?? null;

	const runGeneration = async () => {
		const result = await progress.track(async () => {
			const accepted = await createGeneration({
				jobPostingId,
				style: preferences.style || undefined,
			});
			const id = acceptedIdOf(accepted);
			setGenerationId(id);
			return id;
		});

		applyGeneration(result);
	};

	const handleRegenerate = async () => {
		if (generationId === null) return;

		const result = await progress.track(async () => {
			// 재생성은 기존 id 를 다시 채우는 게 아니라 새 id 로 만들어진다.
			// 예전처럼 원래 id 를 계속 보면 이미 끝난 옛 결과를 보고 곧장
			// '완료' 로 판정해 버리므로, 응답이 준 새 id 로 갈아탄다.
			const accepted = await regenerateGeneration(generationId);
			const nextId = acceptedIdOf(accepted) ?? generationId;
			setGenerationId(nextId);
			return nextId;
		});

		applyGeneration(result);
	};

	// 결과물은 이미 만들어져 있으니 여기서는 최종 미리보기로 넘기기만 한다.
	const handleGoToPreview = () => navigate(ROUTES.CREATE_PREVIEW);

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
		if (templateId === null && entryMode !== 'manage') {
			setTemplatePage(pageOfTemplate(templateId));
			setTemplateModalOpen(true);
		}
	};

	// 최초 진입 흐름에서 템플릿까지 고르고 나면 곧바로 생성을 시작한다.
	// 헤더 아이콘으로 템플릿만 바꾼 경우(dismissible)에는 다시 만들지 않는다.
	const handleCloseTemplate = async () => {
		const isInitialFlow = !templateModalDismissible;
		setTemplateModalOpen(false);

		if (!isInitialFlow || !isLoggedIn || generationId !== null) return;
		await runGeneration();
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
				<Button size="lg" onClick={handleGoToPreview} disabled={progress.running}>
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

					{(draftError || progress.error || portfolioError) && (
						<ErrorText role="alert">
							{draftError || progress.error || portfolioError}
						</ErrorText>
					)}

					<Fields>
						{RESULT_SECTIONS.map(({ key, label }) => (
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
									setTemplatePage(pageOfTemplate(templateId));
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

					{/* 전체화면·최종 결과물과 같은 컴포넌트. 좁은 칸이라 panel(축소 렌더)로 그린다. */}
					<Preview>
						<PortfolioPreview
							data={portfolioData}
							templateId={templateId}
							variant="panel"
							showPhoto={false}
						/>
					</Preview>
				</Card>
			</Columns>

			<Modal open={preferencesModalOpen} onClose={handleClosePreferences} title="맞춤화 설정">
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
										style:
											preferences.style === option.value ? '' : option.value,
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
				width="1000px"
			>
				<TemplatePager>
					<PagerButton
						type="button"
						onClick={() => setTemplatePage((page) => page - 1)}
						disabled={templatePage === 0}
						aria-label="이전 템플릿 보기"
					>
						‹
					</PagerButton>

					<TemplateViewport>
						<TemplateTrack $page={templatePage}>
							{TEMPLATE_PAGES.map((templates, page) => (
								// 화면 밖 페이지는 보이지 않으므로 탭 순서와 읽기에서도 빼 둔다.
								// (모달이 포커스를 가두는 탓에, 빼 두지 않으면 안 보이는 카드로
								//  포커스가 넘어가 사라진 것처럼 읽힌다)
								<TemplatePage key={page} inert={page !== templatePage}>
									{templates.map((template) => {
										const selected =
											normalizeTemplateId(templateId) === template.id;
										const swatch = TEMPLATE_SWATCH[template.id];

										return (
											<TemplateCard
												key={template.id}
												type="button"
												onClick={() => setTemplateId(template.id)}
												aria-pressed={selected}
											>
												<TemplateThumb
													$swatch={swatch}
													$selected={selected}
												>
													<ThumbBar
														$swatch={swatch}
														$accent
														$height="20%"
													/>
													<ThumbBar $swatch={swatch} $height="14%" />
													<ThumbBar $swatch={swatch} $height="14%" />
												</TemplateThumb>
												<TemplateName $selected={selected}>
													{template.name}
												</TemplateName>
											</TemplateCard>
										);
									})}
								</TemplatePage>
							))}
						</TemplateTrack>
					</TemplateViewport>

					<PagerButton
						type="button"
						onClick={() => setTemplatePage((page) => page + 1)}
						disabled={templatePage >= TEMPLATE_PAGE_COUNT - 1}
						aria-label="다음 템플릿 보기"
					>
						›
					</PagerButton>
				</TemplatePager>
				<ModalFooter>
					<Button disabled={!templateId} onClick={handleCloseTemplate}>
						선택 완료
					</Button>
				</ModalFooter>
			</Modal>

			{/* 최종 결과물 미리보기와 '같은 것'을 보여줘야 하는 자리라 같은 컴포넌트를
			    쓰고, 모달 폭도 그에 맞춰 화면 대부분을 채운다. */}
			<Modal
				open={fullscreenOpen}
				onClose={() => setFullscreenOpen(false)}
				title="임시 결과 사이트 미리보기 (전체화면)"
				width="94vw"
			>
				<PortfolioPreview
					data={portfolioData}
					templateId={templateId}
					variant="full"
					showPhoto={false}
				/>
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
