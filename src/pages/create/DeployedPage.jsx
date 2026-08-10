import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from '@emotion/styled';
import Button from '../../components/common/Button';
import { ROUTES } from '../../constants/routes';
import { selectIsLoggedIn, useAuthStore } from '../../store/authStore';
import { useCreateFlowStore } from '../../store/createFlowStore';
import { downloadFile } from '../../api/generations';
import { messageOf } from '../../api/client';

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

// URL 줄 아래는 남는 세로 공간을 전부 비운다.
const UrlRow = styled.div`
	display: flex;
	gap: 16px;
	margin-bottom: auto;
`;

const UrlBox = styled.p`
	flex: 1;
	height: 56px;
	display: flex;
	align-items: center;
	justify-content: center;
	padding: 0 20px;
	font-size: 15px;
	background: ${({ theme }) => theme.colors.surfaceSolid};
	border: 1px solid ${({ theme }) => theme.colors.border};
	border-radius: ${({ theme }) => theme.radii.md};
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

	const [copied, setCopied] = useState(false);
	const [downloading, setDownloading] = useState(false);
	const [downloadError, setDownloadError] = useState('');

	const portfolioUrl = `${window.location.origin}/u/username`;

	const handleCopy = async () => {
		await navigator.clipboard.writeText(portfolioUrl);
		setCopied(true);
		setTimeout(() => setCopied(false), 2000);
	};

	// 서버가 파일 본문(blob)을 그대로 내려주므로 링크를 만들어 눌러 준다.
	const handleDownload = async () => {
		if (generationId === null) return;

		setDownloading(true);
		setDownloadError('');

		try {
			const blob = await downloadFile(generationId);
			const url = URL.createObjectURL(blob);
			const link = document.createElement('a');

			link.href = url;
			link.download = `portai-resume-${generationId}.pdf`;
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

			<UrlRow>
				<UrlBox>{portfolioUrl}</UrlBox>
				<Button size="lg" onClick={handleCopy}>
					{copied ? '복사됨!' : 'URL 복사하기'}
				</Button>
			</UrlRow>

			<Actions>
				<ActionButton
					variant="secondary"
					size="lg"
					onClick={handleDownload}
					disabled={generationId === null || downloading}
				>
					{downloading ? '내려받는 중...' : '이력서(PDF) 다운로드'}
				</ActionButton>

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
