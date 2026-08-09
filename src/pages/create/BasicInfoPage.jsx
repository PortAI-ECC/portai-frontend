import { useNavigate } from 'react-router-dom';
import styled from '@emotion/styled';
import CreateStepLayout from '../../components/layout/CreateStepLayout';
import Field from '../../components/common/Field';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import { ROUTES } from '../../constants/routes';
import { useCreateFlowStore } from '../../store/createFlowStore';

const Form = styled.form`
	max-width: 520px;
	margin: 0 auto;
	display: flex;
	flex-direction: column;
	gap: 24px;
`;

const Submit = styled.div`
	display: flex;
	justify-content: flex-end;
	margin-top: 8px;
`;

const Note = styled.p`
	margin-top: 40px;
	text-align: center;
	font-size: 13px;
	color: ${({ theme }) => theme.colors.textMuted};
`;

const FIELDS = [
	{ name: 'name', label: '이름', placeholder: '이름을 입력하세요', required: true },
	{ name: 'major', label: '전공/학과', placeholder: '전자전기공학과' },
	{ name: 'desiredRole', label: '희망 직무', placeholder: '비워두면 AI가 추천해드려요' },
	{ name: 'email', label: '이메일', type: 'email', placeholder: 'portai@example.com' },
	{ name: 'phone', label: '연락처', placeholder: '010-0000-0000' },
];

function BasicInfoPage() {
	const navigate = useNavigate();
	const basicInfo = useCreateFlowStore((state) => state.basicInfo);
	const setBasicInfo = useCreateFlowStore((state) => state.setBasicInfo);

	const handleChange = (event) => {
		setBasicInfo({ [event.target.name]: event.target.value });
	};

	const handleSubmit = (event) => {
		event.preventDefault();
		navigate(ROUTES.CREATE_LINKS);
	};

	return (
		<CreateStepLayout step={0} title="기본 정보 입력" align="center">
			<Form onSubmit={handleSubmit}>
				{FIELDS.map(({ name, label, type = 'text', placeholder, required }) => (
					<Field key={name} label={label} htmlFor={name}>
						<Input
							id={name}
							name={name}
							type={type}
							placeholder={placeholder}
							value={basicInfo[name]}
							onChange={handleChange}
							required={required}
						/>
					</Field>
				))}

				<Submit>
					<Button type="submit" size="lg">
						다음
					</Button>
				</Submit>
			</Form>

			<Note>로그인 시 저장되어 다음번에는 입력하지 않아도 돼요</Note>
		</CreateStepLayout>
	);
}

export default BasicInfoPage;
