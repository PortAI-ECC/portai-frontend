import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from '@emotion/styled';
import Button from '../../components/common/Button';
import LoadingOverlay from '../../components/common/LoadingOverlay';
import { useDelayedVisible } from '../../hooks/useDelayedVisible';
import PortfolioPreview from '../../components/result/PortfolioPreview';
import { usePortfolioTemplateData } from '../../hooks/usePortfolioTemplateData';
import { ROUTES } from '../../constants/routes';
import { useCreateFlowStore } from '../../store/createFlowStore';
import { selectIsLoggedIn, useAuthStore } from '../../store/authStore';
import { getGeneration } from '../../api/generations';
import { encodePortfolioSlug } from '../../utils/shareLink';

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
// 템플릿이 저마다 전면 배경을 그리므로, 그 배경이 흰 매트 없이 프레임 모서리까지
// 차게 padding 을 두지 않는다(overflow-x 만 hidden 으로 둬 둥근 모서리는 유지).
const Frame = styled.div`
	flex: 1;
	min-height: 0;
	overflow: hidden auto;
	background: ${({ theme }) => theme.colors.surfaceSolid};
	border: 1px solid ${({ theme }) => theme.colors.border};
	border-radius: ${({ theme }) => theme.radii.xl};

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
	padding: 20px 24px 0;
	font-size: 14px;
	color: ${({ theme }) => theme.colors.danger};
`;

function FinalPreviewPage() {
	const navigate = useNavigate();
	const isLoggedIn = useAuthStore(selectIsLoggedIn);
	const generationId = useCreateFlowStore((state) => state.generationId);
	const templateId = useCreateFlowStore((state) => state.templateId);

	const [generation, setGeneration] = useState(null);
	const [loading, setLoading] = useState(isLoggedIn && generationId !== null);
	const [error, setError] = useState('');
	const {
		data: portfolioData,
		loading: recordsLoading,
		error: portfolioError,
	} = usePortfolioTemplateData(generation);
	// 금방 끝나면 로딩 모달을 아예 띄우지 않는다(걸린 시간으로만 판단).
	// 결과물 로딩과 레코드 로딩을 합쳐서, 레코드가 늦게 도착해 빈 포트폴리오가
	// 잠깐 번쩍이는 걸 막는다.
	const showLoading = useDelayedVisible(loading || recordsLoading);

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

	// 배포 완료 화면에서도 계속 필요한 결과물 id 는 주소에 실어 보낸다(새로고침에도
	// 살아남게). 공유 링크의 slug 도 여기서 미리 만들어 넘긴다.
	//
	// 내용이 하나도 없으면 링크를 만들지 않는다. slug 에는 발급 시점의 내용이 통째로
	// 박히므로 빈 채로 만들면 나중에 채워 넣어도 그 링크는 영영 빈 화면이다.
	// (실제로 이름·이메일조차 없는 링크가 배포된 적이 있다.)
	const handleDone = async () => {
		if (portfolioData.isEmpty) {
			setError('아직 담을 내용이 없어요. 기본 정보나 활동 이력을 먼저 입력해 주세요.');
			return;
		}

		const shareSlug = await encodePortfolioSlug({ data: portfolioData, templateId });

		navigate(
			generationId === null ? ROUTES.CREATE_DONE : `${ROUTES.CREATE_DONE}?id=${generationId}`,
			{ state: { shareSlug } },
		);
	};

	return (
		<Wrapper>
			<Title>최종 결과물 미리보기</Title>

			<LoadingOverlay open={showLoading} message="결과물을 불러오는 중이에요" />

			<Frame>
				{(error || portfolioError) && (
					<ErrorText role="alert">{error || portfolioError}</ErrorText>
				)}

				{/* 임시 결과의 전체화면 미리보기와 같은 컴포넌트를 써서 둘이 어긋나지 않게 한다. */}
				{!loading && !recordsLoading && !error && (
					<PortfolioPreview
						data={portfolioData}
						templateId={templateId}
						variant="full"
						showPhoto={false}
					/>
				)}
			</Frame>

			<Actions>
				<Button variant="secondary" size="lg" onClick={() => navigate(ROUTES.CREATE_DRAFT)}>
					이전으로
				</Button>
				<Button size="lg" onClick={handleDone}>
					완료
				</Button>
			</Actions>
		</Wrapper>
	);
}

export default FinalPreviewPage;
