import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from '@emotion/styled';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import Field from '../components/common/Field';
import Input from '../components/common/Input';
import Spinner from '../components/common/Spinner';
import { DefaultAvatarIcon } from '../components/common/icons';
import { ROUTES } from '../constants/routes';
import { selectIsLoggedIn, useAuthStore } from '../store/authStore';
import { logIn } from '../api/auth';
import { getProfile } from '../api/profile';
import { messageOf } from '../api/client';

const Layout = styled.div`
	max-width: 1280px;
	margin: 0 auto;
	display: grid;
	/* 텍스트 칸이 남는 그리드 공간을 다 먹지 않도록 폭을 직접 제한해
	   카드와의 사이가 gap 값 그대로 보이게 한다. */
	grid-template-columns: minmax(0, 560px) minmax(360px, 400px);
	justify-content: space-between;
	gap: 120px;
	align-items: center;
	min-height: 60vh;

	@media (max-width: 900px) {
		grid-template-columns: 1fr;
		gap: 48px;
	}
`;

const Eyebrow = styled.p`
	font-family: ${({ theme }) => theme.font.display};
	font-size: 13px;
	font-weight: 600;
	letter-spacing: 0.18em;
	text-transform: uppercase;
	color: ${({ theme }) => theme.colors.text};
	padding-bottom: 20px;
	border-bottom: 1px solid ${({ theme }) => theme.colors.hairline};
	margin-bottom: 40px;
`;

const Headline = styled.h1`
	font-size: 48px;
	font-weight: 700;
	line-height: 1.25;
	letter-spacing: -0.02em;
`;

const Lead = styled.p`
	margin-top: 24px;
	font-size: 16px;
	color: ${({ theme }) => theme.colors.textSub};
	max-width: 460px;
`;

const Highlights = styled.ul`
	margin-top: 40px;
	padding-top: 32px;
	border-top: 1px solid ${({ theme }) => theme.colors.hairline};
	display: flex;
	flex-direction: column;
	gap: 20px;
`;

const Highlight = styled.li`
	display: flex;
	align-items: center;
	gap: 12px;
	font-size: 15px;

	&::before {
		content: '';
		flex: none;
		width: 8px;
		height: 8px;
		border-radius: 2px;
		background: ${({ theme }) => theme.gradients.brand};
	}
`;

const Form = styled.form`
	display: flex;
	flex-direction: column;
	gap: 20px;
`;

const CardTitle = styled.h2`
	font-size: 20px;
	font-weight: 700;
`;

// 비로그인일 땐 '비로그인으로 진행', 로그인일 땐 '마이페이지' 링크로 재사용한다.
const FooterLink = styled.button`
	font-size: 14px;
	color: ${({ theme }) => theme.colors.textSub};
	&:hover {
		color: ${({ theme }) => theme.colors.primary};
	}
`;

// 회원가입 안내와 붙어 보여서 따로 떼어 둔다. 로그인/회원가입과는 결이 다른
// '인증을 건너뛴다'는 선택이라, 사이를 벌려 다른 갈래로 읽히게 한다.
const GuestLink = styled(FooterLink)`
	margin-top: 12px;
`;

const ErrorText = styled.p`
	font-size: 13px;
	color: ${({ theme }) => theme.colors.danger};
`;

// 로그인 화면(LoginPage)의 회원가입 안내와 같은 모양으로 맞춘다.
const SignUpRow = styled.p`
	font-size: 14px;
	color: ${({ theme }) => theme.colors.textSub};
	text-align: center;
`;

const SignUpLink = styled.button`
	font-weight: 700;
	color: ${({ theme }) => theme.colors.primary};
`;

// 로그인 상태에서 홈에 오면 로그인 폼 대신 이 카드가 같은 자리·크기로 뜬다.
const ProfileBody = styled.div`
	display: flex;
	flex-direction: column;
	gap: 20px;
`;

const ProfileHead = styled.div`
	display: flex;
	align-items: center;
	gap: 16px;
`;

const Avatar = styled.div`
	flex: none;
	width: 56px;
	height: 56px;
	border-radius: 50%;
	overflow: hidden;
	display: grid;
	place-items: center;
	background: ${({ theme }) => theme.colors.primarySoft};
	color: ${({ theme }) => theme.colors.primary};

	img {
		width: 100%;
		height: 100%;
		object-fit: cover;
	}

	svg {
		width: 28px;
		height: 28px;
	}
`;

const ProfileName = styled.h2`
	font-size: 22px;
	font-weight: 700;
`;

const ProfileFields = styled.dl`
	display: flex;
	flex-direction: column;
	gap: 14px;
`;

const ProfileRow = styled.div`
	display: flex;
	flex-direction: column;
	gap: 4px;
`;

const ProfileLabel = styled.dt`
	font-size: 12px;
	color: ${({ theme }) => theme.colors.textMuted};
`;

const ProfileValue = styled.dd`
	font-size: 15px;
	color: ${({ theme }) => theme.colors.text};
`;

const HIGHLIGHTS = [
	'희망 직무에 맞춰 초점을 맞춘 포트폴리오 생성',
	'채용 공고 분석 후 맞춤형 결과물 제공',
	'생성 후에도 자유롭게 편집·업데이트 가능',
];

// GET /api/profile 응답에서 이 순서대로, 값이 있는 것만 보여준다.
const PROFILE_FIELDS = [
	{ key: 'email', label: '이메일' },
	{ key: 'desiredJob', label: '희망 직무' },
	{ key: 'introOneLiner', label: '한 줄 소개' },
];

function LoginCard({ form, error, submitting, onChange, onSubmit, onGuest, onSignUp }) {
	return (
		<Form onSubmit={onSubmit}>
			<CardTitle>로그인</CardTitle>

			<Field label="이메일" htmlFor="email">
				<Input
					id="email"
					name="email"
					type="email"
					autoComplete="email"
					placeholder="portai@example.com"
					value={form.email}
					onChange={onChange}
					required
				/>
			</Field>

			<Field label="비밀번호" htmlFor="password">
				<Input
					id="password"
					name="password"
					type="password"
					autoComplete="current-password"
					placeholder="비밀번호를 입력하세요"
					value={form.password}
					onChange={onChange}
					required
				/>
			</Field>

			{error && <ErrorText>{error}</ErrorText>}

			<Button type="submit" size="lg" fullWidth disabled={submitting}>
				{submitting ? '로그인 중...' : '로그인'}
			</Button>

			{/* 헤더의 회원가입은 카드에서 멀어 눈에 안 띈다는 피드백을 받아,
			    로그인 화면과 같은 자리에 카드 안쪽으로 들여왔다. */}
			<SignUpRow>
				계정이 없으신가요?{' '}
				<SignUpLink type="button" onClick={onSignUp}>
					회원가입
				</SignUpLink>
			</SignUpRow>

			<GuestLink type="button" onClick={onGuest}>
				비로그인으로 진행 →
			</GuestLink>
		</Form>
	);
}

function ProfileCard({ profile, loading, onOpenMyPage }) {
	if (loading) return <Spinner message="프로필을 불러오는 중..." />;

	return (
		<ProfileBody>
			<ProfileHead>
				<Avatar>
					{profile?.profileImageUrl ? (
						<img src={profile.profileImageUrl} alt="" />
					) : (
						<DefaultAvatarIcon />
					)}
				</Avatar>
				{profile?.name && <ProfileName>{profile.name}</ProfileName>}
			</ProfileHead>

			<ProfileFields>
				{PROFILE_FIELDS.filter(({ key }) => profile?.[key]).map(({ key, label }) => (
					<ProfileRow key={key}>
						<ProfileLabel>{label}</ProfileLabel>
						<ProfileValue>{profile[key]}</ProfileValue>
					</ProfileRow>
				))}
			</ProfileFields>

			<FooterLink type="button" onClick={onOpenMyPage}>
				마이페이지 →
			</FooterLink>
		</ProfileBody>
	);
}

function HomePage() {
	const navigate = useNavigate();
	const isLoggedIn = useAuthStore(selectIsLoggedIn);
	const signIn = useAuthStore((state) => state.signIn);

	const [form, setForm] = useState({ email: '', password: '' });
	const [error, setError] = useState('');
	const [submitting, setSubmitting] = useState(false);

	const [profile, setProfile] = useState(null);
	const [profileLoading, setProfileLoading] = useState(isLoggedIn);

	// 로그인 상태로 홈에 오면 로그인 폼 대신 이 프로필을 보여준다.
	// (로그인은 항상 마이페이지로 이동시키므로, 홈이 isLoggedIn=true 로 보이는 건
	// 로고 클릭 등으로 새로 진입했을 때뿐이라 초기 state 만으로 로딩 표시가 맞는다.)
	useEffect(() => {
		if (!isLoggedIn) return;

		getProfile()
			.then(setProfile)
			.catch(() => setProfile(null))
			.finally(() => setProfileLoading(false));
	}, [isLoggedIn]);

	const handleChange = (event) => {
		const { name, value } = event.target;
		setForm((prev) => ({ ...prev, [name]: value }));
	};

	const handleSubmit = async (event) => {
		event.preventDefault();
		setError('');
		setSubmitting(true);

		try {
			const data = await logIn(form);
			signIn({
				accessToken: data.accessToken,
				refreshToken: data.refreshToken,
				user: data.user,
			});
			navigate(ROUTES.MYPAGE);
		} catch (requestError) {
			setError(messageOf(requestError, '이메일 또는 비밀번호를 확인해 주세요.'));
		} finally {
			setSubmitting(false);
		}
	};

	return (
		<Layout>
			<div>
				<Eyebrow>AI Portfolio Generator</Eyebrow>
				<Headline>
					AI가 완성하는
					<br />
					나만의 포트폴리오
				</Headline>
				<Lead>
					Velog·GitHub 등 기술블로그와 활동 이력을 넣으면 AI가 포트폴리오 웹페이지와
					이력서(PDF)를 자동으로 만들어드립니다.
				</Lead>
				<Highlights>
					{HIGHLIGHTS.map((text) => (
						<Highlight key={text}>{text}</Highlight>
					))}
				</Highlights>
			</div>

			<Card>
				{isLoggedIn ? (
					<ProfileCard
						profile={profile}
						loading={profileLoading}
						onOpenMyPage={() => navigate(ROUTES.MYPAGE)}
					/>
				) : (
					<LoginCard
						form={form}
						error={error}
						submitting={submitting}
						onChange={handleChange}
						onSubmit={handleSubmit}
						onGuest={() => navigate(ROUTES.CREATE_BASIC)}
						onSignUp={() => navigate(ROUTES.SIGNUP)}
					/>
				)}
			</Card>
		</Layout>
	);
}

export default HomePage;
