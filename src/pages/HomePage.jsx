import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from '@emotion/styled';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import Field from '../components/common/Field';
import Input from '../components/common/Input';
import { ROUTES } from '../constants/routes';
import { useAuthStore } from '../store/authStore';
import { logIn } from '../api/auth';
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

const GuestLink = styled.button`
	font-size: 14px;
	color: ${({ theme }) => theme.colors.textSub};
	&:hover {
		color: ${({ theme }) => theme.colors.primary};
	}
`;

const ErrorText = styled.p`
	font-size: 13px;
	color: ${({ theme }) => theme.colors.danger};
`;

const HIGHLIGHTS = [
	'희망 직무에 맞춰 초점을 맞춘 포트폴리오 생성',
	'채용 공고 분석 후 맞춤형 결과물 제공',
	'생성 후에도 자유롭게 편집·업데이트 가능',
];

function HomePage() {
	const navigate = useNavigate();
	const signIn = useAuthStore((state) => state.signIn);

	const [form, setForm] = useState({ email: '', password: '' });
	const [error, setError] = useState('');
	const [submitting, setSubmitting] = useState(false);

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
				<Form onSubmit={handleSubmit}>
					<CardTitle>로그인</CardTitle>

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

					{error && <ErrorText>{error}</ErrorText>}

					<Button type="submit" size="lg" fullWidth disabled={submitting}>
						{submitting ? '로그인 중...' : '로그인'}
					</Button>

					<GuestLink type="button" onClick={() => navigate(ROUTES.CREATE_BASIC)}>
						비로그인으로 진행 →
					</GuestLink>
				</Form>
			</Card>
		</Layout>
	);
}

export default HomePage;
