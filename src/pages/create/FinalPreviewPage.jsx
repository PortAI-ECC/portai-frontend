import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from '@emotion/styled';
import Button from '../../components/common/Button';
import LoadingOverlay from '../../components/common/LoadingOverlay';
import { useDelayedVisible } from '../../hooks/useDelayedVisible';
import ResultPreview from '../../components/result/ResultPreview';
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

const Actions = styled.div`
	flex: none;
	margin-top: 24px;
	display: flex;
	justify-content: center;
	gap: 16px;
`;

const ErrorText = styled.p`
	font-size: 14px;
	color: ${({ theme }) => theme.colors.danger};
`;

function FinalPreviewPage() {
	const navigate = useNavigate();
	const isLoggedIn = useAuthStore(selectIsLoggedIn);
	const generationId = useCreateFlowStore((state) => state.generationId);

	const [generation, setGeneration] = useState(null);
	const [loading, setLoading] = useState(isLoggedIn && generationId !== null);
	const [error, setError] = useState('');
	// 금방 끝나면 로딩 모달을 아예 띄우지 않는다(걸린 시간으로만 판단).
	const showLoading = useDelayedVisible(loading);

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

	return (
		<Wrapper>
			<Title>최종 결과물 미리보기</Title>

			<LoadingOverlay open={showLoading} message="결과물을 불러오는 중이에요" />

			<Frame>
				{error && <ErrorText role="alert">{error}</ErrorText>}

				{/* 임시 결과의 전체화면 미리보기와 같은 컴포넌트를 써서 둘이 어긋나지 않게 한다. */}
				{!loading && !error && <ResultPreview generation={generation} />}
			</Frame>

			<Actions>
				<Button variant="secondary" size="lg" onClick={() => navigate(ROUTES.CREATE_DRAFT)}>
					이전으로
				</Button>
				{/* 배포 완료 화면은 들어가자마자 위자드를 비우므로, 거기서도 계속
				    필요한 결과물 id 는 주소에 실어 보낸다(새로고침에도 살아남게). */}
				<Button
					size="lg"
					onClick={() =>
						navigate(
							generationId === null
								? ROUTES.CREATE_DONE
								: `${ROUTES.CREATE_DONE}?id=${generationId}`,
						)
					}
				>
					완료
				</Button>
			</Actions>
		</Wrapper>
	);
}

export default FinalPreviewPage;
