import { Outlet } from 'react-router-dom';
import styled from '@emotion/styled';
import Header from './Header';

const Main = styled.main`
	max-width: ${({ theme }) => theme.layout.maxWidth};
	margin: 0 auto;
	padding: 32px 32px 80px;
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
