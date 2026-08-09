import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from '@emotion/styled';
import Button from '../../components/common/Button';
import Spinner from '../../components/common/Spinner';
import { ROUTES } from '../../constants/routes';

const Title = styled.h1`
	font-size: 24px;
	font-weight: 900;
	margin-bottom: 24px;
`;

const Frame = styled.div`
	min-height: 620px;
	background: ${({ theme }) => theme.colors.surfaceSolid};
	border: 1px solid ${({ theme }) => theme.colors.border};
	border-radius: ${({ theme }) => theme.radii.xl};
	display: grid;
	place-items: center;
	color: ${({ theme }) => theme.colors.textMuted};
	font-size: 15px;
`;

const Actions = styled.div`
	margin-top: 32px;
	display: flex;
	justify-content: flex-end;
	gap: 16px;
`;

function FinalPreviewPage() {
	const navigate = useNavigate();
	const [generating, setGenerating] = useState(false);

	// AI 생성은 수 초 이상 걸릴 수 있어, 대기 중임을 스피너로 반드시 알린다.
	const handleGenerate = () => {
		setGenerating(true);
		navigate(ROUTES.CREATE_DONE);
	};

	return (
		<>
			<Title>최종 결과물 미리보기 (수정 불가)</Title>

			<Frame>
				{generating ? (
					<Spinner full message="포트폴리오를 생성하고 있어요..." />
				) : (
					'전체 화면 미리보기'
				)}
			</Frame>

			<Actions>
				<Button variant="secondary" size="lg" onClick={() => navigate(ROUTES.CREATE_DRAFT)}>
					돌아가기
				</Button>
				<Button size="lg" onClick={handleGenerate} disabled={generating}>
					생성하기
				</Button>
			</Actions>
		</>
	);
}

export default FinalPreviewPage;
