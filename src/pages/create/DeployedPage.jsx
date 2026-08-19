import { useEffect, useState } from 'react';
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import styled from '@emotion/styled';
import Button from '../../components/common/Button';
import { ROUTES } from '../../constants/routes';
import { selectIsLoggedIn, useAuthStore } from '../../store/authStore';
import { useCreateFlowStore } from '../../store/createFlowStore';
import { downloadFile } from '../../api/generations';
import { messageOf } from '../../api/client';
import { SHARE_URL_LIMIT } from '../../utils/shareLink';

// 이력서 버튼이 화면 세로 2/3 쯤, 안내 문구가 최하단에 오도록
// 화면 높이를 채운 뒤 남는 공간을 URL 아래에 몰아준다.
const Wrapper = styled.div`
	max-width: 900px;
	min-height: calc(100vh - ${({ theme }) => theme.layout.headerHeight} - 112px);
	margin: 0 auto;
	padding-top: 6vh;
	display: flex;
	flex-direction: column;
	text-align: center;
`;

const Title = styled.h1`
	font-size: 32px;
	font-weight: 900;
	margin-bottom: 40px;
`;

// URL 줄(과 복사 실패 안내) 아래는 남는 세로 공간을 전부 비운다.
const UrlSection = styled.div`
	margin-bottom: auto;
`;

const UrlRow = styled.div`
	display: flex;
	gap: 16px;
`;

// flex 컨테이너 자신에 text-overflow: ellipsis 를 주면 justify-content: center 와
// 맞물려 넘치는 텍스트의 양쪽이 잘려 중간 부분만 보인다(주소가 http:// 로 안 시작하는
// 것처럼 보였던 원인). 말줄임은 안쪽 span 에 맡기고, 이 요소는 왼쪽 정렬만 한다.
const UrlBox = styled.p`
	flex: 1;
	height: 56px;
	display: flex;
	align-items: center;
	justify-content: flex-start;
	padding: 0 20px;
	font-size: 15px;
	background: ${({ theme }) => theme.colors.surfaceSolid};
	border: 1px solid ${({ theme }) => theme.colors.border};
	border-radius: ${({ theme }) => theme.radii.md};
	overflow: hidden;
`;

const UrlText = styled.span`
	overflow: hidden;
	text-overflow: ellipsis;
	white-space: nowrap;
`;

const Actions = styled.div`
	display: flex;
	flex-direction: column;
	align-items: center;
	gap: 20px;
`;

// 두 버튼의 길이를 맞춘다.
const ActionButton = styled(Button)`
	width: 320px;
`;

// 로그인 상태에도 이 자리를 그대로 차지하게 둬서(내용만 숨김), 두 버튼의
// 위치가 비로그인 화면과 똑같이 맞춰지게 한다.
// 직무 추천 API(POST /api/job-postings/recommend 류)가 아직 명세서에
// 비어 있어서, 자리만 잡아둔 정적 예시다. 스키마 나오면 실제 응답으로 바꾼다.
const RECOMMENDED_JOBS = [
	'임베디드 AI 엔지니어',
	'Edge AI 엔지니어',
	'AI 펌웨어 엔지니어',
	'NPU 설계 엔지니어',
];

const RecommendSection = styled.div`
	margin-top: 56px;
	padding-top: 32px;
	border-top: 1px solid ${({ theme }) => theme.colors.border};
`;

const RecommendTitle = styled.p`
	font-size: 14px;
	font-weight: 700;
	margin-bottom: 16px;
`;

const TagRow = styled.div`
	display: flex;
	flex-wrap: wrap;
	justify-content: center;
	gap: 10px;
`;

const Tag = styled.span`
	font-size: 13px;
	font-weight: 600;
	padding: 8px 16px;
	border-radius: ${({ theme }) => theme.radii.pill};
	background: ${({ theme }) => theme.colors.primarySoft};
	color: ${({ theme }) => theme.colors.primary};
`;

const ErrorText = styled.p`
	font-size: 13px;
	color: ${({ theme }) => theme.colors.danger};
`;

const CopyErrorText = styled(ErrorText)`
	margin-top: 12px;
	text-align: left;
`;

const Hint = styled.p`
	font-size: 13px;
	color: ${({ theme }) => theme.colors.textMuted};
`;

const Note = styled.p`
	margin-top: auto;
	padding-top: 40px;
	font-size: 13px;
	color: ${({ theme }) => theme.colors.textMuted};
	visibility: ${({ $hidden }) => ($hidden ? 'hidden' : 'visible')};
`;

function DeployedPage() {
	const navigate = useNavigate();
	const isLoggedIn = useAuthStore(selectIsLoggedIn);
	const generationId = useCreateFlowStore((state) => state.generationId);
	const reset = useCreateFlowStore((state) => state.reset);

	const [copied, setCopied] = useState(false);
	const [copyError, setCopyError] = useState('');
	const [downloading, setDownloading] = useState(false);
	const [downloadError, setDownloadError] = useState('');

	// 배포까지 끝났으면 이 위자드는 여기서 완결이다. 입력값과 '어디까지 가봤는지'를
	// 비워 둬야, 다음에 '새로 만들기'로 들어왔을 때 1단계부터 다시 밟게 된다.
	//
	// 다만 이 화면은 스토어를 비운 뒤에도 결과물 id 가 계속 필요하다(PDF 내려받기).
	// 첫 렌더 값만 붙잡아 두면 새로고침했을 때는 이미 비워진 뒤라 id 를 잃는다.
	// 그래서 앞 화면이 주소로 넘겨준 id 를 먼저 보고, 없을 때만 스토어를 쓴다.
	const [searchParams] = useSearchParams();
	const idFromUrl = Number(searchParams.get('id')) || null;
	const [idFromStore] = useState(generationId);
	const downloadableId = idFromUrl ?? idFromStore;

	useEffect(() => {
		reset();
	}, [reset]);

	// 공유 링크는 조회 API 없이 내용을 slug 안에 통째로 담는다(utils/shareLink).
	// 앞 화면이 스토어가 비워지기 전에 만들어 넘겨준 것을 그대로 쓴다.
	// slug 는 경로가 아니라 해시(#)로 붙인다 — PortfolioPage 상단 주석 참고.
	const { state } = useLocation();
	const shareSlug = state?.shareSlug ?? '';
	const portfolioUrl = shareSlug
		? `${window.location.origin}${ROUTES.PORTFOLIO}#${shareSlug}`
		: '';
	const urlTooLong = portfolioUrl.length > SHARE_URL_LIMIT;

	// 클립보드는 https(또는 localhost)가 아니거나 권한이 막히면 그냥 실패한다.
	// 조용히 넘어가면 사용자는 복사된 줄 알기 때문에 실패도 화면에 알린다.
	const handleCopy = async () => {
		setCopyError('');

		try {
			await navigator.clipboard.writeText(portfolioUrl);
			setCopied(true);
			setTimeout(() => setCopied(false), 2000);
		} catch {
			setCopyError('복사하지 못했어요. 위 주소를 직접 선택해 복사해 주세요.');
		}
	};

	// 서버가 파일 본문(blob)을 그대로 내려주므로 링크를 만들어 눌러 준다.
	const handleDownload = async () => {
		if (downloadableId === null) return;

		setDownloading(true);
		setDownloadError('');

		try {
			// 다운로드는 결과물 종류별로 나뉜다. 이 버튼이 주는 건 이력서다.
			const blob = await downloadFile(downloadableId, 'RESUME');
			const url = URL.createObjectURL(blob);
			const link = document.createElement('a');

			link.href = url;
			link.download = `portai-resume-${downloadableId}.pdf`;
			document.body.appendChild(link);
			link.click();
			link.remove();
			URL.revokeObjectURL(url);
		} catch (requestError) {
			setDownloadError(messageOf(requestError, '다운로드에 실패했어요.'));
		} finally {
			setDownloading(false);
		}
	};

	return (
		<Wrapper>
			<Title>배포 완료 🎉</Title>

			<UrlSection>
				{portfolioUrl ? (
					<>
						<UrlRow>
							<UrlBox>
								<UrlText>{portfolioUrl}</UrlText>
							</UrlBox>
							<Button size="lg" onClick={handleCopy} disabled={urlTooLong}>
								{copied ? '복사됨!' : 'URL 복사하기'}
							</Button>
						</UrlRow>
						{urlTooLong && (
							<CopyErrorText role="alert">
								내용이 많아 주소가 너무 길어졌어요. 항목을 줄이고 다시 만들면 공유할
								수 있어요.
							</CopyErrorText>
						)}
						{copyError && <CopyErrorText role="alert">{copyError}</CopyErrorText>}
					</>
				) : (
					<Hint>
						미리보기 화면에서 &lsquo;완료&rsquo;를 눌러야 공유 주소가 만들어져요.
					</Hint>
				)}
			</UrlSection>

			<Actions>
				{/* PDF 는 서버가 만들어 둔 결과물을 받아오는 것이라, 결과물이 서버에
				    저장되지 않는 비로그인 진행에서는 내려받을 대상 자체가 없다. */}
				<ActionButton
					variant="secondary"
					size="lg"
					onClick={handleDownload}
					disabled={downloadableId === null || downloading}
				>
					{downloading ? '내려받는 중...' : '이력서(PDF) 다운로드'}
				</ActionButton>

				{downloadableId === null && (
					<Hint>로그인하고 만들면 이력서를 PDF로 내려받을 수 있어요.</Hint>
				)}

				{downloadError && <ErrorText role="alert">{downloadError}</ErrorText>}

				{isLoggedIn ? (
					<ActionButton size="lg" onClick={() => navigate(ROUTES.MYPAGE)}>
						마이페이지
					</ActionButton>
				) : (
					<ActionButton size="lg" onClick={() => navigate(ROUTES.HOME)}>
						로그인으로 결과 저장하기
					</ActionButton>
				)}
			</Actions>

			<Note $hidden={isLoggedIn}>
				로그인하면 만든 포트폴리오를 마이페이지에서 다시 열 수 있어요.
			</Note>

			<RecommendSection>
				<RecommendTitle>이런 직무는 어때요?</RecommendTitle>
				<TagRow>
					{RECOMMENDED_JOBS.map((job) => (
						<Tag key={job}>#{job}</Tag>
					))}
				</TagRow>
			</RecommendSection>
		</Wrapper>
	);
}

export default DeployedPage;
