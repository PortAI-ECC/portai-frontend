import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import styled from '@emotion/styled';
import PortfolioPreview from '../components/result/PortfolioPreview';
import { decodePortfolioSlug } from '../utils/shareLink';

const Fallback = styled.div`
	max-width: ${({ theme }) => theme.layout.maxWidth};
	margin: 0 auto;
	padding: 120px 32px;
	text-align: center;
`;

const FallbackTitle = styled.h1`
	font-size: 22px;
	font-weight: 900;
	margin-bottom: 12px;
`;

const FallbackText = styled.p`
	font-size: 14px;
	line-height: 1.7;
	color: ${({ theme }) => theme.colors.textMuted};
`;

// 배포된 포트폴리오는 로그인 없이 누구나 볼 수 있는 Public Route 다.
// 내용은 slug 안에 통째로 담겨 오므로 이 화면은 API 를 부르지 않는다(utils/shareLink).
//
// slug 는 경로가 아니라 해시(#)로 싣는다. 해시는 스펙상 서버로 전송되지 않아
// Netlify 접속 로그나(이름·이메일이 든) Referer 헤더로 새 나가지 않는다 —
// 경로였다면 이 화면에서 바깥 링크(GitHub 등)를 눌렀을 때 그 서버에도 노출됐을 것.
function PortfolioPage() {
	const { hash } = useLocation();
	const slug = hash.slice(1);
	// 압축 해제가 비동기라 첫 렌더에는 결과가 없다. 아직 푸는 중(undefined)과
	// 풀지 못함(null)을 구분해야 멀쩡한 링크에도 오류 문구가 번쩍이지 않는다.
	const [portfolio, setPortfolio] = useState(undefined);

	useEffect(() => {
		let cancelled = false;

		decodePortfolioSlug(slug).then((result) => {
			if (!cancelled) setPortfolio(result);
		});

		return () => {
			cancelled = true;
		};
	}, [slug]);

	if (portfolio === undefined) return null;

	if (!portfolio) {
		return (
			<Fallback>
				<FallbackTitle>포트폴리오를 열 수 없어요</FallbackTitle>
				<FallbackText>
					주소가 잘못됐거나 복사하는 과정에서 일부가 잘린 것 같아요.
					<br />
					공유받은 링크 전체를 다시 확인해 주세요.
				</FallbackText>
			</Fallback>
		);
	}

	return (
		<PortfolioPreview
			data={portfolio.data}
			templateId={portfolio.templateId}
			variant="full"
			showPhoto={false}
		/>
	);
}

export default PortfolioPage;
