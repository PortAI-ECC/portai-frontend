import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from '@emotion/styled';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import Field from '../components/common/Field';
import Input from '../components/common/Input';
import Modal from '../components/common/Modal';
import { ROUTES } from '../constants/routes';
import { signUp } from '../api/auth';
import { messageOf } from '../api/client';
import { formatPhone, isValidPhone, PHONE_MESSAGE } from '../utils/phone';

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

const SuccessBody = styled.div`
	display: flex;
	flex-direction: column;
	gap: 20px;
	text-align: center;
`;

const SuccessMessage = styled.p`
	font-size: 14px;
	color: ${({ theme }) => theme.colors.textSub};
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
	// 가입 직후 홈으로 바로 넘겨버리면 성공했는지 헷갈려서, 확인 모달을
	// 닫아야 비로소 이동한다.
	const [signedUpName, setSignedUpName] = useState(null);

	const phoneRef = useRef(null);

	// 연락처는 비어 있을 때와 형식이 틀렸을 때 모두 같은 말풍선을 띄운다.
	// 그냥 두면 빈 값에는 브라우저 기본 문구('이 입력란을 작성하세요.')가 따로
	// 떠서 안내가 두 갈래로 갈린다. 값이 바뀔 때마다 우리 문구로 덮어 하나로 만든다.
	useEffect(() => {
		phoneRef.current?.setCustomValidity(isValidPhone(form.phone) ? '' : PHONE_MESSAGE);
	}, [form.phone]);

	const handleChange = (event) => {
		const { name, value } = event.target;
		setForm((prev) => ({ ...prev, [name]: value }));
	};

	// 하이픈을 어디에 넣든(혹은 안 넣든) 칸을 벗어나는 순간 한 모양으로 맞춘다.
	// 그러고도 자릿수가 안 맞으면 이메일 칸과 똑같이 브라우저 말풍선으로 알린다.
	// 아직 한 글자도 안 쳤을 때까지 다그치지는 않는다.
	const handlePhoneBlur = () => {
		const formatted = formatPhone(form.phone);
		setForm((prev) => ({ ...prev, phone: formatted }));

		if (formatted && !isValidPhone(formatted)) {
			const input = phoneRef.current;
			input?.setCustomValidity(PHONE_MESSAGE);
			input?.reportValidity();
		}
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
				// 칸을 안 벗어나고 바로 제출하면 아직 하이픈이 없다. 서버에는 늘 같은 모양으로.
				phone: formatPhone(form.phone),
			});
			// signup 응답에는 토큰이 없어 자동 로그인이 불가능하다.
			// 모달을 닫을 때 로그인 화면으로 보낸다.
			setSignedUpName(form.name);
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

					<Field label="이름" htmlFor="name" required>
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

					<Field label="이메일" htmlFor="email" required>
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

					<Field
						label="연락처"
						htmlFor="phone"
						message="하이픈 없이 입력해도 자동으로 맞춰 드려요."
						required
					>
						<Input
							ref={phoneRef}
							id="phone"
							name="phone"
							type="tel"
							autoComplete="tel"
							placeholder="010-0000-0000"
							value={form.phone}
							onChange={handleChange}
							onBlur={handlePhoneBlur}
							// required/pattern 은 일부러 안 건다. 걸면 상황마다 브라우저 기본
							// 문구가 따로 떠서, 위 effect 의 한 문장으로 통일되지 않는다.
						/>
					</Field>

					{/* 입력칸 안내글이 이미 '8자 이상 입력하세요' 라, 아래에 같은 말을
					    또 두면 겹쳐 읽힌다. 안내는 placeholder 하나로 둔다. */}
					<Field label="비밀번호" htmlFor="password" required>
						<Input
							id="password"
							name="password"
							type="password"
							autoComplete="new-password"
							placeholder="8자 이상 입력하세요"
							minLength={8}
							value={form.password}
							onChange={handleChange}
							required
						/>
					</Field>

					<Field label="비밀번호 확인" htmlFor="passwordConfirm" required>
						<Input
							id="passwordConfirm"
							name="passwordConfirm"
							type="password"
							autoComplete="new-password"
							placeholder="비밀번호를 다시 입력하세요"
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
						<LoginLink type="button" onClick={() => navigate(ROUTES.LOGIN)}>
							로그인
						</LoginLink>
					</Footer>
				</Form>
			</Card>

			<Modal
				open={signedUpName !== null}
				onClose={() => navigate(ROUTES.LOGIN)}
				title="회원가입 완료"
			>
				<SuccessBody>
					<SuccessMessage>
						{signedUpName}님, 가입이 완료됐어요. 로그인 후 이용해 주세요.
					</SuccessMessage>
					<Button size="lg" onClick={() => navigate(ROUTES.LOGIN)}>
						로그인하러 가기
					</Button>
				</SuccessBody>
			</Modal>
		</Wrapper>
	);
}

export default SignUpPage;
