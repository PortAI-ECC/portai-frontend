import { useNavigate } from 'react-router-dom';
import styled from '@emotion/styled';
import Button from '../../components/common/Button';
import { ROUTES } from '../../constants/routes';

// 실제 배포된 사이트에 들어간 것처럼 보이는 게 이 화면의 목적이라,
// 폭 제한 없이 현재 화면 세로를 거의 꽉 채운다.
const Wrapper = styled.div`
	height: calc(100vh - ${({ theme }) => theme.layout.headerHeight} - 112px);
	min-height: 520px;
	display: flex;
	flex-direction: column;
`;

const Title = styled.h1`
	flex: none;
	font-size: 24px;
	font-weight: 900;
	margin-bottom: 20px;
	text-align: center;
`;

// 와이어프레임대로 결과물 안쪽에 스크롤을 둔다. 페이지 자체는 스크롤되지 않는다.
const Frame = styled.div`
	flex: 1;
	min-height: 0;
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
	flex: none;
	margin-top: 24px;
	display: flex;
	justify-content: center;
	gap: 16px;
`;

function FinalPreviewPage() {
	const navigate = useNavigate();

	return (
		<Wrapper>
			<Title>최종 결과물 미리보기</Title>

			<Frame>
				<Sections>
					<Block $height="220px" />
					<BlockRow>
						<Block $height="240px" />
						<Block $height="240px" />
					</BlockRow>
					<Block $height="320px" />
					<Block $height="260px" />
					<Block $height="320px" />
				</Sections>
			</Frame>

			<Actions>
				<Button variant="secondary" size="lg" onClick={() => navigate(ROUTES.CREATE_DRAFT)}>
					이전으로
				</Button>
				<Button size="lg" onClick={() => navigate(ROUTES.CREATE_DONE)}>
					완료
				</Button>
			</Actions>
		</Wrapper>
	);
}

export default FinalPreviewPage;
