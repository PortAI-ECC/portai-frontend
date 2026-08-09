import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from '@emotion/styled';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import Field from '../components/common/Field';
import Input from '../components/common/Input';
import { ROUTES } from '../constants/routes';
import { signUp } from '../api/auth';
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

const LoginLink = styled.button`
	font-weight: 700;
	color: ${({ theme }) => theme.colors.primary};
`;

function SignUpPage() {
	const navigate = useNavigate();

	// 명세서상 signup 은 name / email / password / phone 을 모두 요구한다.
	const [form, setForm] = useState({
		name: '',
		email: '',
		phone: '',
		password: '',
		passwordConfirm: '',
	});
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
			await signUp({
				name: form.name,
				email: form.email,
				password: form.password,
				phone: form.phone,
			});
			// signup 응답에는 토큰이 없어 자동 로그인이 불가능하다. 로그인 화면으로 보낸다.
			navigate(ROUTES.HOME);
		} catch (requestError) {
			setError(messageOf(requestError, '회원가입에 실패했어요. 잠시 후 다시 시도해 주세요.'));
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

					<Field label="이름" htmlFor="name">
						<Input
							id="name"
							name="name"
							autoComplete="name"
							placeholder="이름을 입력하세요"
							value={form.name}
							onChange={handleChange}
							required
						/>
					</Field>

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

					<Field label="연락처" htmlFor="phone">
						<Input
							id="phone"
							name="phone"
							type="tel"
							autoComplete="tel"
							placeholder="010-0000-0000"
							value={form.phone}
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
