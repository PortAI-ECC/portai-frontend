import { Outlet, useLocation } from 'react-router-dom';
import styled from '@emotion/styled';
import Header from './Header';
import { ROUTES } from '../../constants/routes';

// 최종 결과물 미리보기는 실제 사이트에 들어간 느낌을 줘야 해서
// 다른 화면과 달리 가로 상한을 두지 않는다.
const FULL_WIDTH_ROUTES = new Set([ROUTES.CREATE_PREVIEW]);

const Main = styled.main`
	max-width: ${({ theme, $fullWidth }) => ($fullWidth ? 'none' : theme.layout.maxWidth)};
	margin: 0 auto;
	padding: 32px 32px 80px;
`;

function AppLayout() {
	const { pathname } = useLocation();

	return (
		<>
			<Header />
			<Main $fullWidth={FULL_WIDTH_ROUTES.has(pathname)}>
				<Outlet />
			</Main>
		</>
	);
}

export default AppLayout;
