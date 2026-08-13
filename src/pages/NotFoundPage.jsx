import { Link } from 'react-router-dom';
import styled from '@emotion/styled';
import { ROUTES } from '../constants/routes';

const Wrapper = styled.div`
	padding: 120px 0;
	text-align: center;
`;

const Code = styled.p`
	font-size: 64px;
	font-weight: 900;
	background: ${({ theme }) => theme.gradients.brand};
	background-clip: text;
	-webkit-background-clip: text;
	color: transparent;
`;

const Message = styled.p`
	margin: 16px 0 32px;
	color: ${({ theme }) => theme.colors.textSub};
`;

const HomeLink = styled(Link)`
	font-weight: 700;
	color: ${({ theme }) => theme.colors.primary};
`;

function NotFoundPage() {
	return (
		<Wrapper>
			<Code>404</Code>
			<Message>요청하신 페이지를 찾을 수 없어요.</Message>
			<HomeLink to={ROUTES.HOME}>홈으로 돌아가기</HomeLink>
		</Wrapper>
	);
}

export default NotFoundPage;
