import { useNavigate } from 'react-router-dom';
import styled from '@emotion/styled';
import Button from '../../components/common/Button';
import { ROUTES } from '../../constants/routes';

const Title = styled.h1`
	font-size: 24px;
	font-weight: 900;
	margin-bottom: 24px;
`;

// 와이어프레임대로 결과물 안쪽에 스크롤을 둔다. 페이지 자체는 스크롤되지 않는다.
const Frame = styled.div`
	height: 640px;
	overflow-y: auto;
	background: ${({ theme }) => theme.colors.surfaceSolid};
	border: 1px solid ${({ theme }) => theme.colors.border};
	border-radius: ${({ theme }) => theme.radii.xl};
	padding: 32px;

	&::-webkit-scrollbar {
		width: 10px;
	}
	&::-webkit-scrollbar-thumb {
		background: ${({ theme }) => theme.colors.border};
		border-radius: 999px;
	}
	&::-webkit-scrollbar-track {
		background: transparent;
	}
`;

const Sections = styled.div`
	display: flex;
	flex-direction: column;
	gap: 20px;
`;

const Block = styled.div`
	height: ${({ $height }) => $height};
	border-radius: ${({ theme }) => theme.radii.md};
	background: ${({ theme }) => theme.colors.primarySoft};
`;

const BlockRow = styled.div`
	display: grid;
	grid-template-columns: 1fr 1fr;
	gap: 20px;
`;

const Actions = styled.div`
	margin-top: 32px;
	display: flex;
	justify-content: flex-end;
	gap: 16px;
`;

function FinalPreviewPage() {
	const navigate = useNavigate();

	return (
		<>
			<Title>최종 결과물 미리보기 (수정 불가)</Title>

			<Frame>
				<Sections>
					<Block $height="180px" />
					<BlockRow>
						<Block $height="200px" />
						<Block $height="200px" />
					</BlockRow>
					<Block $height="260px" />
					<Block $height="220px" />
					<Block $height="260px" />
				</Sections>
			</Frame>

			<Actions>
				<Button variant="secondary" size="lg" onClick={() => navigate(ROUTES.CREATE_DRAFT)}>
					돌아가기
				</Button>
				<Button size="lg" onClick={() => navigate(ROUTES.CREATE_DONE)}>
					완료
				</Button>
			</Actions>
		</>
	);
}

export default FinalPreviewPage;
