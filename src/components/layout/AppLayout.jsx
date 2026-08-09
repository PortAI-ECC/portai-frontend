import { Outlet } from 'react-router-dom';
import styled from '@emotion/styled';
import Header from './Header';

const Main = styled.main`
	max-width: ${({ theme }) => theme.layout.maxWidth};
	margin: 0 auto;
	padding: 48px 32px 96px;
`;

function AppLayout() {
	return (
		<>
			<Header />
			<Main>
				<Outlet />
			</Main>
		</>
	);
}

export default AppLayout;
