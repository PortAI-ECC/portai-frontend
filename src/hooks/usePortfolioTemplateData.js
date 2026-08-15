import { useEffect, useMemo, useState } from 'react';
import { selectIsLoggedIn, useAuthStore } from '../store/authStore';
import { useCreateFlowStore } from '../store/createFlowStore';
import { fetchPortfolioRecords } from '../api/portfolio';
import { buildPortfolioTemplateData } from '../components/result/portfolioTemplateData';

/**
 * 로그인 사용자의 실제 레코드(프로젝트·공모전·경력·자격증·교육·활동이력·기술스택)를
 * 불러와 6개 템플릿이 쓰는 모양으로 합친다. DraftResultPage 와 FinalPreviewPage 가
 * 이 훅 하나를 공유해서 fetch 코드가 중복되지 않는다.
 *
 * preferences.emphasizedTypes 는 DraftResultPage 가 이미 getPreferences() 로 불러와
 * 스토어에 써 두므로(그 값이 persist 되어 FinalPreviewPage 에서도 그대로 읽힌다),
 * 여기서 또 부르지 않는다 — 중복 요청을 피하기 위해서다.
 */
export function usePortfolioTemplateData(generation) {
	const isLoggedIn = useAuthStore(selectIsLoggedIn);
	const basicInfo = useCreateFlowStore((state) => state.basicInfo);
	const emphasizedTypes = useCreateFlowStore((state) => state.preferences.emphasizedTypes);

	const [records, setRecords] = useState(null);
	const [loading, setLoading] = useState(isLoggedIn);
	const [error, setError] = useState('');

	useEffect(() => {
		// 로그인 상태가 아니면 애초에 loading 초기값이 false 라 여기서 더 손댈 게 없다.
		if (!isLoggedIn) return undefined;

		let cancelled = false;

		fetchPortfolioRecords()
			.then((result) => {
				if (cancelled) return;
				setRecords(result);
				setError(result.failed.length > 0 ? '일부 항목을 불러오지 못했어요.' : '');
			})
			.catch(() => {
				if (!cancelled) setError('활동 이력을 불러오지 못했어요.');
			})
			.finally(() => {
				if (!cancelled) setLoading(false);
			});

		return () => {
			cancelled = true;
		};
	}, [isLoggedIn]);

	const intro = useMemo(
		() =>
			(generation?.results ?? []).find((result) => result.type === 'SELF_INTRODUCTION')
				?.content ?? '',
		[generation],
	);

	const data = useMemo(
		() => buildPortfolioTemplateData({ records, basicInfo, intro, emphasis: emphasizedTypes }),
		[records, basicInfo, intro, emphasizedTypes],
	);

	return { data, loading, error };
}
