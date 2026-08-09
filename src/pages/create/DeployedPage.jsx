import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from '@emotion/styled';
import Button from '../../components/common/Button';
import { ROUTES } from '../../constants/routes';
import { selectIsLoggedIn, useAuthStore } from '../../store/authStore';

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

const Note = styled.p`
	margin-top: auto;
	padding-top: 40px;
	font-size: 13px;
	color: ${({ theme }) => theme.colors.textMuted};
`;

function DeployedPage() {
	const navigate = useNavigate();
	const isLoggedIn = useAuthStore(selectIsLoggedIn);
	const [copied, setCopied] = useState(false);

	const portfolioUrl = `${window.location.origin}/u/username`;

	const handleCopy = async () => {
		await navigator.clipboard.writeText(portfolioUrl);
		setCopied(true);
		setTimeout(() => setCopied(false), 2000);
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
				<Button variant="secondary" size="lg">
					이력서(PDF) 다운로드
				</Button>

				{isLoggedIn ? (
					<Button variant="secondary" size="lg" onClick={() => navigate(ROUTES.MYPAGE)}>
						마이페이지로 이동
					</Button>
				) : (
					<>
						<Button variant="secondary" size="lg" onClick={() => navigate(ROUTES.HOME)}>
							로그인으로 결과 저장하기
						</Button>
					</>
				)}
			</Actions>

			{!isLoggedIn && (
				<Note>로그인하면 만든 포트폴리오를 마이페이지에서 다시 열 수 있어요.</Note>
			)}
		</Wrapper>
	);
}

export default DeployedPage;
