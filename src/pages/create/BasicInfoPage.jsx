import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from '@emotion/styled';
import CreateStepLayout from '../../components/layout/CreateStepLayout';
import Field from '../../components/common/Field';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import { DefaultAvatarIcon } from '../../components/common/icons';
import AxolotlMiniIcon from '../../components/character/AxolotlMiniIcon';
import { ROUTES } from '../../constants/routes';
import { useCreateFlowStore } from '../../store/createFlowStore';
import { selectIsLoggedIn, useAuthStore } from '../../store/authStore';
import { getProfile, updateProfile } from '../../api/profile';
import { messageOf } from '../../api/client';
import { formatPhone } from '../../utils/phone';

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

const ErrorText = styled.p`
	font-size: 13px;
	color: ${({ theme }) => theme.colors.danger};
`;

const PhotoRow = styled.div`
	display: flex;
	align-items: center;
	gap: 20px;
`;

const PhotoPreview = styled.div`
	flex: none;
	width: 72px;
	height: 72px;
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
		width: 32px;
		height: 32px;
	}
`;

const PhotoActions = styled.div`
	display: flex;
	flex-direction: column;
	gap: 4px;
`;

// 진한 흰색 secondary 버튼이 아바타 옆에서 너무 튀어서, 배경은 아래
// 텍스트 입력창과, 글자색은 '이름' 라벨과 같은 톤(textSub, #6B5A93)으로
// 맞춘다.
const PhotoButton = styled(Button)`
	background: ${({ theme }) => theme.colors.surface};
	border-color: ${({ theme }) => theme.colors.border};
	color: ${({ theme }) => theme.colors.textSub};

	&:hover:not(:disabled) {
		background: ${({ theme }) => theme.colors.surfaceSolid};
	}
`;

const PhotoFileName = styled.span`
	font-size: 13px;
	color: ${({ theme }) => theme.colors.textMuted};
`;

const HiddenFileInput = styled.input`
	display: none;
`;

// 디자인 시안대로 입력창 안내글자 왼쪽에 작은 우파 아이콘을 고정으로 둔다.
const IconField = styled.div`
	position: relative;

	input {
		padding-left: 40px;
	}
`;

const FieldIcon = styled.div`
	position: absolute;
	left: 14px;
	top: 50%;
	transform: translateY(-50%);
	pointer-events: none;
`;

function BasicInfoPage() {
	const navigate = useNavigate();
	const isLoggedIn = useAuthStore(selectIsLoggedIn);
	const basicInfo = useCreateFlowStore((state) => state.basicInfo);
	const setBasicInfo = useCreateFlowStore((state) => state.setBasicInfo);

	const [error, setError] = useState('');
	const [saving, setSaving] = useState(false);

	// 실제 File 은 zustand persist(로컬스토리지) 로 직렬화가 안 돼 컴포넌트 로컬에만 둔다.
	// 새로고침하면 미리보기는 사라지고 파일명만 남는다 — 채용 공고 업로드와 같은 한계.
	const [photoPreviewUrl, setPhotoPreviewUrl] = useState(null);
	const fileInputRef = useRef(null);

	useEffect(() => {
		return () => {
			if (photoPreviewUrl) URL.revokeObjectURL(photoPreviewUrl);
		};
	}, [photoPreviewUrl]);

	// 로그인 상태면 저장된 프로필로 채워 준다. 비로그인은 로컬 입력만 유지한다.
	useEffect(() => {
		if (!isLoggedIn) return;

		getProfile()
			.then((profile) => {
				setBasicInfo({
					name: profile.name ?? '',
					email: profile.email ?? '',
					phone: profile.phone ?? '',
					desiredJob: profile.desiredJob ?? '',
					introOneLiner: profile.introOneLiner ?? '',
				});
			})
			.catch(() => setError('프로필을 불러오지 못했어요. 입력한 내용은 그대로 사용됩니다.'));
	}, [isLoggedIn, setBasicInfo]);

	const handleChange = (event) => {
		setBasicInfo({ [event.target.name]: event.target.value });
	};

	const handlePhotoSelect = (event) => {
		const file = event.target.files?.[0];
		if (!file) return;

		setPhotoPreviewUrl((prev) => {
			if (prev) URL.revokeObjectURL(prev);
			return URL.createObjectURL(file);
		});
		setBasicInfo({ photoName: file.name });
	};

	const handleSubmit = async (event) => {
		event.preventDefault();

		// 명세서상 수정 가능한 필드만 저장한다. 이름·이메일·연락처는 가입 정보다.
		if (isLoggedIn) {
			setSaving(true);
			try {
				await updateProfile({
					introOneLiner: basicInfo.introOneLiner,
					desiredJob: basicInfo.desiredJob,
				});
			} catch (requestError) {
				setError(messageOf(requestError, '프로필 저장에 실패했어요.'));
				setSaving(false);
				return;
			}
			setSaving(false);
		}

		navigate(ROUTES.CREATE_LINKS);
	};

	return (
		<CreateStepLayout step={0} title="기본 정보 입력" align="center">
			<Form onSubmit={handleSubmit}>
				<Field label="프로필 사진">
					<PhotoRow>
						<PhotoPreview>
							{photoPreviewUrl ? (
								<img src={photoPreviewUrl} alt="" />
							) : (
								<DefaultAvatarIcon />
							)}
						</PhotoPreview>
						<PhotoActions>
							<PhotoButton
								type="button"
								variant="secondary"
								size="sm"
								onClick={() => fileInputRef.current?.click()}
							>
								사진 선택
							</PhotoButton>
							{basicInfo.photoName && (
								<PhotoFileName>{basicInfo.photoName}</PhotoFileName>
							)}
						</PhotoActions>
						<HiddenFileInput
							ref={fileInputRef}
							type="file"
							accept="image/*"
							onChange={handlePhotoSelect}
						/>
					</PhotoRow>
				</Field>

				<Field label="이름" htmlFor="name" required>
					<Input
						id="name"
						name="name"
						placeholder="이름을 입력하세요"
						value={basicInfo.name}
						onChange={handleChange}
						required
					/>
				</Field>

				<Field label="전공/학과" htmlFor="major">
					<Input
						id="major"
						name="major"
						placeholder="예) 전자전기공학과"
						value={basicInfo.major}
						onChange={handleChange}
					/>
				</Field>

				<Field label="이메일" htmlFor="email" required>
					<Input
						id="email"
						name="email"
						type="email"
						placeholder="portai@example.com"
						value={basicInfo.email}
						onChange={handleChange}
						required
					/>
				</Field>

				<Field label="연락처" htmlFor="phone">
					<Input
						id="phone"
						name="phone"
						type="tel"
						placeholder="010-0000-0000"
						value={basicInfo.phone}
						onChange={handleChange}
						onBlur={() => setBasicInfo({ phone: formatPhone(basicInfo.phone) })}
					/>
				</Field>

				<Field label="희망 직무" htmlFor="desiredJob">
					<IconField>
						<FieldIcon>
							<AxolotlMiniIcon size={20} title="" />
						</FieldIcon>
						<Input
							id="desiredJob"
							name="desiredJob"
							placeholder="비워두면 AI가 추천해드려요!"
							value={basicInfo.desiredJob}
							onChange={handleChange}
						/>
					</IconField>
				</Field>

				<Field
					label="한 줄 소개"
					htmlFor="introOneLiner"
					message="포트폴리오 첫 화면에 들어갑니다."
				>
					<Input
						id="introOneLiner"
						name="introOneLiner"
						placeholder="문제 해결을 좋아하는 프론트엔드 개발자입니다."
						value={basicInfo.introOneLiner}
						onChange={handleChange}
					/>
				</Field>

				{error && <ErrorText role="alert">{error}</ErrorText>}

				<Submit>
					<Button type="submit" size="lg" disabled={saving}>
						{saving ? '저장 중...' : '다음'}
					</Button>
				</Submit>
			</Form>

			<Note>로그인 시 저장되어 다음번에는 입력하지 않아도 돼요</Note>
		</CreateStepLayout>
	);
}

export default BasicInfoPage;
