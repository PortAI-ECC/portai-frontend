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

// 밑줄은 항상 떠 있고, 호버 표시는 밑줄이 아니라 반투명 흰 상자로 준다.
const NavLink = styled.button`
	font-family: ${({ theme }) => theme.font.display};
	font-size: 14px;
	font-weight: 600;
	letter-spacing: 0.08em;
	text-transform: uppercase;
	color: ${({ theme }) => theme.colors.text};
	padding: 6px 12px 6px;
	border-radius: ${({ theme }) => theme.radii.sm};
	border-bottom: 2px solid ${({ theme }) => theme.colors.text};
	background: transparent;
	transition: background 0.15s;

	&:hover {
		background: rgba(255, 255, 255, 0.45);
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
	const isMyPage = pathname === ROUTES.MYPAGE;

	// 로그인 여부와 무관하게 같은 자리를 쓴다. 시작 화면만 조용한 텍스트 링크.
	const renderAction = () => {
		if (isLoggedIn) {
			// 이미 마이페이지에 있으면 '마이페이지로 이동' 버튼은 의미가 없다.
			// 그 자리를 로그아웃으로 대신한다.
			if (isMyPage) {
				return <Button onClick={handleSignOut}>로그아웃</Button>;
			}

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
					{isLoggedIn && !isMyPage && (
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
