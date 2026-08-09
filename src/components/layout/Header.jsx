import { Link, useLocation, useNavigate } from 'react-router-dom';
import styled from '@emotion/styled';
import Button from '../common/Button';
import Logo from './Logo';
import { ROUTES } from '../../constants/routes';
import { selectIsLoggedIn, useAuthStore } from '../../store/authStore';
import { logOut } from '../../api/auth';

// 표지처럼 배경 그라데이션이 그대로 비치도록 헤더는 바 없이 얹기만 한다.
const Bar = styled.header`
	height: ${({ theme }) => theme.layout.headerHeight};
	display: flex;
	align-items: center;
`;

const Inner = styled.div`
	width: 100%;
	max-width: ${({ theme }) => theme.layout.maxWidth};
	margin: 0 auto;
	padding: 0 32px;
	display: flex;
	align-items: center;
	justify-content: space-between;
	gap: 24px;
`;

const Wordmark = styled(Link)`
	display: flex;
	align-items: center;
	gap: 10px;
	font-family: ${({ theme }) => theme.font.display};
	font-size: 19px;
	font-weight: 700;
	letter-spacing: 0.14em;
	color: ${({ theme }) => theme.colors.text};
`;

const Actions = styled.nav`
	display: flex;
	align-items: center;
	gap: 24px;
`;

const NavLink = styled.button`
	font-family: ${({ theme }) => theme.font.display};
	font-size: 14px;
	font-weight: 600;
	letter-spacing: 0.08em;
	text-transform: uppercase;
	color: ${({ theme }) => theme.colors.text};
	padding-bottom: 6px;
	border-bottom: 2px solid transparent;

	&:hover {
		border-bottom-color: ${({ theme }) => theme.colors.text};
	}
`;

function Header() {
	const navigate = useNavigate();
	const { pathname } = useLocation();
	const isLoggedIn = useAuthStore(selectIsLoggedIn);
	const signOut = useAuthStore((state) => state.signOut);

	const handleSignOut = async () => {
		const { refreshToken } = useAuthStore.getState();

		// 서버 세션 정리는 실패해도 로컬 로그아웃은 진행한다.
		try {
			if (refreshToken) await logOut(refreshToken);
		} catch {
			// 무시
		}

		signOut();
		navigate(ROUTES.HOME);
	};

	// 시작 화면에는 로그인 카드가 이미 있어 헤더는 조용한 텍스트 링크로 두고,
	// 나머지 화면에서는 눈에 띄는 버튼으로 올린다.
	const isHome = pathname === ROUTES.HOME;
	const isSignUp = pathname === ROUTES.SIGNUP;

	// 로그인 여부와 무관하게 같은 자리를 쓴다. 시작 화면만 조용한 텍스트 링크.
	const renderAction = () => {
		if (isLoggedIn) {
			return isHome ? (
				<NavLink type="button" onClick={() => navigate(ROUTES.MYPAGE)}>
					마이페이지
				</NavLink>
			) : (
				<Button onClick={() => navigate(ROUTES.MYPAGE)}>마이페이지</Button>
			);
		}

		// 회원가입 화면에서 회원가입 버튼은 의미가 없으니 홈으로 돌아가는 버튼을 준다.
		if (isSignUp) {
			return <Button onClick={() => navigate(ROUTES.HOME)}>홈</Button>;
		}

		return isHome ? (
			<NavLink type="button" onClick={() => navigate(ROUTES.SIGNUP)}>
				회원가입
			</NavLink>
		) : (
			<Button onClick={() => navigate(ROUTES.SIGNUP)}>회원가입</Button>
		);
	};

	return (
		<Bar>
			<Inner>
				<Wordmark to={ROUTES.HOME}>
					<Logo />
					PORTAI
				</Wordmark>

				<Actions>
					{isLoggedIn && (
						<NavLink type="button" onClick={handleSignOut}>
							로그아웃
						</NavLink>
					)}
					{renderAction()}
				</Actions>
			</Inner>
		</Bar>
	);
}

export default Header;
