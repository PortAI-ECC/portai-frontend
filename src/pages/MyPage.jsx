import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from '@emotion/styled';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import LoadingOverlay from '../components/common/LoadingOverlay';
import { useDelayedVisible } from '../hooks/useDelayedVisible';
import { RECORD_CATEGORIES } from '../constants/recordCategories';
import { ROUTES } from '../constants/routes';
import { getGenerations } from '../api/generations';
import { RECORD_APIS } from '../api/records';
import { projectsApi } from '../api/projects';
import RecordManagerModal from '../components/record/RecordManagerModal';
import { useCreateFlowStore } from '../store/createFlowStore';

// 와이어프레임상 '+ 새로 만들기'는 마이페이지 제목줄 오른쪽에만 있다.
const TitleRow = styled.div`
	display: flex;
	align-items: center;
	justify-content: space-between;
	gap: 16px;
	margin-bottom: 32px;
`;

const PageTitle = styled.h1`
	font-size: 28px;
	font-weight: 900;
`;

const Columns = styled.div`
	display: grid;
	grid-template-columns: 1fr 1fr;
	gap: 40px;
	align-items: start;

	@media (max-width: 1100px) {
		grid-template-columns: 1fr;
	}
`;

// 왼쪽 열에 활동이력·프로젝트 두 카드를 세로로 쌓는다.
const Stack = styled.div`
	display: flex;
	flex-direction: column;
	gap: 40px;
`;

const SectionTitle = styled.h2`
	font-size: 18px;
	font-weight: 700;
	margin-bottom: 24px;
`;

const CategoryGrid = styled.div`
	display: grid;
	grid-template-columns: repeat(3, 1fr);
	gap: 16px;

	@media (max-width: 640px) {
		grid-template-columns: repeat(2, 1fr);
	}
`;

const CategoryCard = styled.button`
	display: flex;
	flex-direction: column;
	gap: 6px;
	min-height: 120px;
	padding: 16px;
	text-align: left;
	background: ${({ theme }) => theme.colors.surfaceSolid};
	border: 1px solid ${({ theme }) => theme.colors.border};
	border-radius: ${({ theme }) => theme.radii.lg};
	transition:
		transform 0.15s,
		box-shadow 0.15s;

	&:hover {
		transform: translateY(-2px);
		box-shadow: ${({ theme }) => theme.shadows.card};
	}
`;

const CategoryName = styled.span`
	font-size: 15px;
	font-weight: 700;
`;

const CategoryCount = styled.span`
	font-size: 13px;
	color: ${({ theme }) => theme.colors.textMuted};
`;

const SiteGrid = styled.div`
	display: grid;
	grid-template-columns: 1fr 1fr;
	gap: 24px;

	@media (max-width: 640px) {
		grid-template-columns: 1fr;
	}
`;

const SiteCard = styled.article`
	display: flex;
	flex-direction: column;
	gap: 12px;
`;

const Thumbnail = styled.div`
	aspect-ratio: 16 / 10;
	border-radius: ${({ theme }) => theme.radii.lg};
	border: 1px solid ${({ theme }) => theme.colors.border};
	background: ${({ theme }) => theme.gradients.page};
	overflow: hidden;
`;

const SiteName = styled.h3`
	font-size: 14px;
	font-weight: 500;
`;

const EmptyText = styled.p`
	font-size: 14px;
	color: ${({ theme }) => theme.colors.textMuted};
`;

function MyPage() {
	const navigate = useNavigate();
	const [generations, setGenerations] = useState(null);
	const [failed, setFailed] = useState(false);
	const [counts, setCounts] = useState({});
	const [openCategory, setOpenCategory] = useState(null);
	const resetFlow = useCreateFlowStore((state) => state.reset);
	const setEntryMode = useCreateFlowStore((state) => state.setEntryMode);
	const showLoading = useDelayedVisible(!failed && generations === null);

	// 새로 만들기는 늘 빈 위자드에서 시작한다.
	const handleCreateNew = () => {
		resetFlow();
		navigate(ROUTES.CREATE_BASIC);
	};

	// 기존 사이트를 다시 여는 길. 여기로 들어와야 재수집처럼
	// '계속 관리하는' 동작들이 나타난다.
	const handleOpenSite = (id) => {
		setEntryMode('manage');
		navigate(`${ROUTES.CREATE_DRAFT}?id=${id}`);
	};

	useEffect(() => {
		getGenerations()
			.then((data) => setGenerations(data.items ?? data.generations ?? data))
			.catch(() => setFailed(true));
	}, []);

	// 카드마다 항목 수를 보여주려면 분류별 목록을 각각 받아야 한다.
	useEffect(() => {
		let cancelled = false;

		const sources = [
			...RECORD_CATEGORIES.map(({ key }) => [key, RECORD_APIS[key]]),
			['projects', projectsApi],
		];

		Promise.all(
			sources.map(([key, api]) =>
				api
					.listItems()
					.then((items) => [key, items.length])
					.catch(() => [key, null]),
			),
		).then((entries) => {
			if (!cancelled) setCounts(Object.fromEntries(entries));
		});

		return () => {
			cancelled = true;
		};
	}, []);

	return (
		<>
			<LoadingOverlay open={showLoading} message="만든 포트폴리오를 불러오는 중이에요" />

			<TitleRow>
				<PageTitle>마이페이지</PageTitle>
				<Button onClick={handleCreateNew}>+ 새로 만들기</Button>
			</TitleRow>

			<Columns>
				<Stack>
					<Card>
						<SectionTitle>활동이력 관리</SectionTitle>
						<CategoryGrid>
							{RECORD_CATEGORIES.map(({ key, label }) => (
								<CategoryCard
									key={key}
									type="button"
									onClick={() => setOpenCategory({ key, label })}
								>
									<CategoryName>{label}</CategoryName>
									<CategoryCount>
										{counts[key] === undefined
											? '불러오는 중...'
											: counts[key] === null
												? '불러오지 못함'
												: `${counts[key]}개 항목`}
									</CategoryCount>
								</CategoryCard>
							))}
						</CategoryGrid>
					</Card>

					<Card>
						<SectionTitle>프로젝트 관리</SectionTitle>
						<CategoryGrid>
							<CategoryCard
								type="button"
								onClick={() =>
									setOpenCategory({ key: 'projects', label: '프로젝트' })
								}
							>
								<CategoryName>프로젝트</CategoryName>
								<CategoryCount>
									{counts.projects === undefined
										? '불러오는 중...'
										: counts.projects === null
											? '불러오지 못함'
											: `${counts.projects}개 항목`}
								</CategoryCount>
							</CategoryCard>
						</CategoryGrid>
					</Card>
				</Stack>

				<Card>
					<SectionTitle>생성한 사이트 관리</SectionTitle>

					{failed && <EmptyText>목록을 불러오지 못했습니다.</EmptyText>}
					{!failed && generations?.length === 0 && (
						<EmptyText>아직 생성한 포트폴리오가 없어요. 새로 만들어 보세요.</EmptyText>
					)}

					{generations?.length > 0 && (
						<SiteGrid>
							{/* 식별자는 명세서 응답 그대로 generationId 다. */}
							{generations.map((item) => (
								<SiteCard key={item.generationId}>
									<Thumbnail
										as="button"
										type="button"
										onClick={() => handleOpenSite(item.generationId)}
									/>
									<SiteName>{item.title ?? '제목 없는 포트폴리오'}</SiteName>
								</SiteCard>
							))}
						</SiteGrid>
					)}
				</Card>
			</Columns>

			{openCategory && (
				<RecordManagerModal
					open
					categoryKey={openCategory.key}
					title={openCategory.label}
					onClose={() => setOpenCategory(null)}
					onChanged={(key, count) => setCounts((prev) => ({ ...prev, [key]: count }))}
				/>
			)}
		</>
	);
}

export default MyPage;
