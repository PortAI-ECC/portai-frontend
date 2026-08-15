import { RECORD_APIS } from './records';
import { projectsApi } from './projects';
import { getProfile } from './profile';
import { getIntegrations } from './integrations';
import { RECORD_CATEGORIES } from '../constants/recordCategories';

/**
 * 포트폴리오 미리보기가 필요로 하는 소스를 한 번에 모은다. MyPage.jsx 의 팬아웃
 * 패턴(Promise.all + 소스별 catch)을 그대로 따른다 — 레코드 하나가 죽어도(특히
 * activitiesApi 는 /activities/me 를 /api 밖으로 쳐서 404 가능성이 가장 높다)
 * 나머지가 계속 뜨게 하려고 소스별로 개별 catch 를 둔다.
 *
 * @returns {Promise<{
 *   profile, projects, contests, careers, certificates, education, techStacks,
 *   activities, integrations, failed: string[]
 * }>}
 */
export async function fetchPortfolioRecords() {
	const sources = [
		['profile', () => getProfile()],
		['projects', () => projectsApi.listItems()],
		...RECORD_CATEGORIES.map(({ key }) => [key, () => RECORD_APIS[key].listItems()]),
		['integrations', () => getIntegrations()],
	];

	const failed = [];
	const entries = await Promise.all(
		sources.map(([key, load]) =>
			load()
				.then((value) => [key, value])
				.catch(() => {
					failed.push(key);
					return [key, null];
				}),
		),
	);

	return { ...Object.fromEntries(entries), failed };
}
