import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from '@emotion/styled';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import Field from '../components/common/Field';
import Input from '../components/common/Input';
import { ROUTES } from '../constants/routes';
import { signUp } from '../api/auth';

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

const LoginLink = styled.button`
	font-weight: 700;
	color: ${({ theme }) => theme.colors.primary};
`;

function SignUpPage() {
	const navigate = useNavigate();

	const [form, setForm] = useState({ email: '', password: '', passwordConfirm: '' });
	const [error, setError] = useState('');
	const [submitting, setSubmitting] = useState(false);

	const handleChange = (event) => {
		const { name, value } = event.target;
		setForm((prev) => ({ ...prev, [name]: value }));
	};

	const handleSubmit = async (event) => {
		event.preventDefault();

		if (form.password !== form.passwordConfirm) {
			setError('비밀번호가 서로 달라요.');
			return;
		}

		setError('');
		setSubmitting(true);

		try {
			await signUp({ email: form.email, password: form.password });
			// 가입 후 자동 로그인은 백엔드 응답 형태가 확정되면 붙인다. 지금은 로그인 화면으로 보낸다.
			navigate(ROUTES.HOME);
		} catch (requestError) {
			setError(
				requestError.response?.status === 409
					? '이미 가입된 이메일이에요.'
					: '회원가입에 실패했어요. 잠시 후 다시 시도해 주세요.',
			);
		} finally {
			setSubmitting(false);
		}
	};

	return (
		<Wrapper>
			<Eyebrow>Create account</Eyebrow>

			<Card>
				<Form onSubmit={handleSubmit}>
					<CardTitle>회원가입</CardTitle>

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

					<Field label="비밀번호" htmlFor="password" message="8자 이상 입력해 주세요.">
						<Input
							id="password"
							name="password"
							type="password"
							autoComplete="new-password"
							placeholder="••••••••"
							minLength={8}
							value={form.password}
							onChange={handleChange}
							required
						/>
					</Field>

					<Field label="비밀번호 확인" htmlFor="passwordConfirm">
						<Input
							id="passwordConfirm"
							name="passwordConfirm"
							type="password"
							autoComplete="new-password"
							placeholder="••••••••"
							value={form.passwordConfirm}
							onChange={handleChange}
							required
						/>
					</Field>

					{error && <ErrorText role="alert">{error}</ErrorText>}

					<Button type="submit" size="lg" fullWidth disabled={submitting}>
						{submitting ? '가입 중...' : '회원가입'}
					</Button>

					<Footer>
						이미 계정이 있으신가요?{' '}
						<LoginLink type="button" onClick={() => navigate(ROUTES.HOME)}>
							로그인
						</LoginLink>
					</Footer>
				</Form>
			</Card>
		</Wrapper>
	);
}

export default SignUpPage;
