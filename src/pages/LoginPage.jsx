import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import styled from '@emotion/styled';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import Field from '../components/common/Field';
import Input from '../components/common/Input';
import { ROUTES } from '../constants/routes';
import { useAuthStore } from '../store/authStore';
import { logIn } from '../api/auth';
import { messageOf } from '../api/client';

const Wrapper = styled.div`
	max-width: 460px;
	margin: 40px auto 0;
`;

const Eyebrow = styled.p`
	font-family: ${({ theme }) => theme.font.display};
	font-size: 13px;
	font-weight: 600;
	letter-spacing: 0.18em;
	text-transform: uppercase;
	padding-bottom: 20px;
	border-bottom: 1px solid ${({ theme }) => theme.colors.hairline};
	margin-bottom: 32px;
`;

const Form = styled.form`
	display: flex;
	flex-direction: column;
	gap: 20px;
`;

const CardTitle = styled.h1`
	font-size: 22px;
	font-weight: 700;
`;

const ErrorText = styled.p`
	font-size: 13px;
	color: ${({ theme }) => theme.colors.danger};
`;

const Footer = styled.p`
	font-size: 14px;
	color: ${({ theme }) => theme.colors.textSub};
	text-align: center;
`;

const FooterLink = styled.button`
	font-weight: 700;
	color: ${({ theme }) => theme.colors.primary};
`;

/**
 * 홈 화면 안에도 로그인 카드가 있지만, 위자드 도중처럼 홈을 거치지 않고
 * 곧장 로그인해야 하는 자리가 있어 단독 화면으로도 둔다.
 * 회원가입 화면과 같은 폭·같은 카드 구성을 쓴다.
 */
function LoginPage() {
	const navigate = useNavigate();
	const location = useLocation();
	const signIn = useAuthStore((state) => state.signIn);

	const [form, setForm] = useState({ email: '', password: '' });
	const [error, setError] = useState('');
	const [submitting, setSubmitting] = useState(false);

	// 위자드 도중에 로그인하러 왔다면 하던 자리로 돌려보낸다.
	const from = location.state?.from ?? null;

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
			navigate(from ?? ROUTES.MYPAGE, { replace: true });
		} catch (requestError) {
			setError(messageOf(requestError, '이메일 또는 비밀번호를 확인해 주세요.'));
		} finally {
			setSubmitting(false);
		}
	};

	return (
		<Wrapper>
			<Eyebrow>Sign in</Eyebrow>

			<Card>
				<Form onSubmit={handleSubmit}>
					<CardTitle>로그인</CardTitle>

					{/* 둘 다 필수지만 두 칸뿐이라 * 없이도 알 수 있어 표시는 생략한다. */}
					<Field label="이메일" htmlFor="email">
						<Input
							id="email"
							name="email"
							type="email"
							autoComplete="email"
							placeholder="portai@example.com"
							value={form.email}
							onChange={handleChange}
							required
						/>
					</Field>

					<Field label="비밀번호" htmlFor="password">
						<Input
							id="password"
							name="password"
							type="password"
							autoComplete="current-password"
							placeholder="••••••••"
							value={form.password}
							onChange={handleChange}
							required
						/>
					</Field>

					{error && <ErrorText role="alert">{error}</ErrorText>}

					<Button type="submit" size="lg" fullWidth disabled={submitting}>
						{submitting ? '로그인 중...' : '로그인'}
					</Button>

					<Footer>
						계정이 없으신가요?{' '}
						<FooterLink type="button" onClick={() => navigate(ROUTES.SIGNUP)}>
							회원가입
						</FooterLink>
					</Footer>
				</Form>
			</Card>
		</Wrapper>
	);
}

export default LoginPage;
