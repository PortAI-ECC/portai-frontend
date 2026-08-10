import { Link, useLocation, useNavigate } from 'react-router-dom';
import styled from '@emotion/styled';
import Button from '../common/Button';
import Logo from './Logo';
import { CREATE_STEPS, ROUTES } from '../../constants/routes';
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

// 진행바가 도는 5단계(기본 정보 입력 ~ 임시 결과).
const WIZARD_PATHS = CREATE_STEPS.map(({ path }) => path);

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

	// 시작 화면에는 로그인 카드(또는 프로필 카드)가 이미 있어 헤더는 조용한
	// 텍스트 링크로 두고, 나머지 화면에서는 눈에 띄는 버튼으로 올린다.
	const isHome = pathname === ROUTES.HOME;
	const isSignUp = pathname === ROUTES.SIGNUP;
	const isLogin = pathname === ROUTES.LOGIN;

	// 위자드 5단계는 진행 자체가 주인공이라, 헤더는 홈과 같은 조용한 텍스트로 둔다.
	const isWizard = WIZARD_PATHS.includes(pathname);
	// 최종 결과물은 결과만 보는 화면이라 헤더에 아무 액션도 두지 않는다.
	const isFinalPreview = pathname === ROUTES.CREATE_PREVIEW;

	// 로그인 상태의 로그아웃만 조용한 텍스트로 둔다. 비로그인의 로그인 버튼은
	// 눌러 줬으면 하는 버튼이라 눈에 띄는 그라데이션 그대로다.
	const quiet = isHome || isWizard;

	// 로그인 상태에서는 헤더에 액션을 하나만 둔다 — 로그아웃.
	// 마이페이지로 가는 길은 홈의 프로필 카드 쪽에 따로 있다.
	const renderAction = () => {
		if (isFinalPreview) return null;

		if (isLoggedIn) {
			return quiet ? (
				<NavLink type="button" onClick={handleSignOut}>
					로그아웃
				</NavLink>
			) : (
				<Button onClick={handleSignOut}>로그아웃</Button>
			);
		}

		// 로그인·회원가입 화면에서 같은 곳으로 가는 버튼은 의미가 없으니 홈으로 보낸다.
		if (isSignUp || isLogin) {
			return <Button onClick={() => navigate(ROUTES.HOME)}>홈</Button>;
		}

		// 위자드 도중이면 회원가입보다 로그인이 먼저다. 로그인 뒤 하던 자리로 돌아온다.
		if (isWizard) {
			return (
				<Button onClick={() => navigate(ROUTES.LOGIN, { state: { from: pathname } })}>
					로그인
				</Button>
			);
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

				<Actions>{renderAction()}</Actions>
			</Inner>
		</Bar>
	);
}

export default Header;
