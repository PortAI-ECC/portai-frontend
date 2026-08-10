import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from '@emotion/styled';
import Button from '../../components/common/Button';
import Spinner from '../../components/common/Spinner';
import { ROUTES } from '../../constants/routes';
import { useCreateFlowStore } from '../../store/createFlowStore';
import { selectIsLoggedIn, useAuthStore } from '../../store/authStore';
import { getGeneration } from '../../api/generations';

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

const ResultSection = styled.section`
	display: flex;
	flex-direction: column;
	gap: 10px;
`;

const ResultTitle = styled.h2`
	font-size: 17px;
	font-weight: 700;
`;

// 생성된 본문은 줄바꿈이 의미를 가지므로 그대로 살린다.
const ResultBody = styled.p`
	font-size: 14px;
	line-height: 1.7;
	color: ${({ theme }) => theme.colors.textSub};
	white-space: pre-wrap;
`;

const ErrorText = styled.p`
	font-size: 14px;
	color: ${({ theme }) => theme.colors.danger};
`;

const RESULT_LABEL = {
	SELF_INTRODUCTION: '자기소개',
	RESUME: '이력서',
	PORTFOLIO: '포트폴리오',
	PROJECT_INTRO: '프로젝트 소개',
	INTERVIEW_QUESTIONS: '예상 면접 질문',
};

function FinalPreviewPage() {
	const navigate = useNavigate();
	const isLoggedIn = useAuthStore(selectIsLoggedIn);
	const generationId = useCreateFlowStore((state) => state.generationId);

	const [generation, setGeneration] = useState(null);
	const [loading, setLoading] = useState(isLoggedIn && generationId !== null);
	const [error, setError] = useState('');

	useEffect(() => {
		if (!isLoggedIn || generationId === null) return;

		let cancelled = false;

		getGeneration(generationId)
			.then((data) => {
				if (!cancelled) setGeneration(data);
			})
			.catch(() => {
				if (!cancelled) setError('결과물을 불러오지 못했어요.');
			})
			.finally(() => {
				if (!cancelled) setLoading(false);
			});

		return () => {
			cancelled = true;
		};
	}, [isLoggedIn, generationId]);

	// 내용이 있는 항목만 보여준다. 아직 생성 전이면 와이어프레임 자리표시자를 그대로 둔다.
	const filled = (generation?.results ?? []).filter((result) => result.content?.trim());

	return (
		<Wrapper>
			<Title>최종 결과물 미리보기</Title>

			<Frame>
				{loading && <Spinner message="결과물을 불러오는 중..." />}
				{error && <ErrorText role="alert">{error}</ErrorText>}

				{!loading && !error && filled.length > 0 && (
					<Sections>
						{filled.map((result) => (
							<ResultSection key={result.type}>
								<ResultTitle>{RESULT_LABEL[result.type] ?? result.type}</ResultTitle>
								<ResultBody>{result.content}</ResultBody>
							</ResultSection>
						))}
					</Sections>
				)}

				{!loading && !error && filled.length === 0 && (
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
				)}
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
