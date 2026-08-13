import { useParams } from 'react-router-dom';
import styled from '@emotion/styled';

const Wrapper = styled.div`
	max-width: ${({ theme }) => theme.layout.maxWidth};
	margin: 0 auto;
	padding: 80px 32px;
`;

const Slug = styled.p`
	font-size: 14px;
	color: ${({ theme }) => theme.colors.textMuted};
`;

// 배포된 포트폴리오는 로그인 없이 누구나 볼 수 있는 Public Route 다.
function PortfolioPage() {
	const { slug } = useParams();

	return (
		<Wrapper>
			<Slug>/u/{slug}</Slug>
		</Wrapper>
	);
}

export default PortfolioPage;
