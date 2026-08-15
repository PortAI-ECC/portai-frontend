import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from '@emotion/styled';
import CreateStepLayout from '../../components/layout/CreateStepLayout';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import LoadingOverlay from '../../components/common/LoadingOverlay';
import { useDelayedVisible } from '../../hooks/useDelayedVisible';
import { ROUTES } from '../../constants/routes';
import { useCreateFlowStore } from '../../store/createFlowStore';
import { selectIsLoggedIn, useAuthStore } from '../../store/authStore';
import {
	createIntegration,
	deleteIntegration,
	getIntegrations,
	getSyncStatus,
	syncIntegration,
} from '../../api/integrations';
import { messageOf } from '../../api/client';

const AddRow = styled.form`
	display: flex;
	gap: 16px;
	margin-bottom: 32px;
`;

const List = styled.ul`
	display: flex;
	flex-direction: column;
	gap: 16px;
`;

const Item = styled.li`
	display: flex;
	align-items: center;
	gap: 20px;
	padding: 16px;
	background: ${({ theme }) => theme.colors.surface};
	border: 1px solid ${({ theme }) => theme.colors.border};
	border-radius: ${({ theme }) => theme.radii.lg};
`;

const Favicon = styled.div`
	flex: none;
	width: 44px;
	height: 44px;
	border-radius: ${({ theme }) => theme.radii.md};
	background: ${({ theme }) => theme.colors.primarySoft};
	display: grid;
	place-items: center;
	font-size: 18px;
`;

const ItemBody = styled.div`
	flex: 1;
	min-width: 0;
`;

const ItemTitle = styled.p`
	font-size: 15px;
	font-weight: 700;
`;

const ItemUrl = styled.p`
	font-size: 13px;
	color: ${({ theme }) => theme.colors.textMuted};
	overflow: hidden;
	text-overflow: ellipsis;
	white-space: nowrap;
`;

const Status = styled.span`
	flex: none;
	font-size: 12px;
	font-weight: 700;
	padding: 4px 12px;
	border-radius: 999px;
	background: ${({ theme, $done }) => ($done ? theme.colors.primarySoft : 'transparent')};
	color: ${({ theme, $done }) => ($done ? theme.colors.primary : theme.colors.textMuted)};
`;

const Empty = styled.p`
	padding: 48px 0;
	text-align: center;
	font-size: 14px;
	color: ${({ theme }) => theme.colors.textMuted};
`;

const ErrorText = styled.p`
	margin-bottom: 16px;
	font-size: 13px;
	color: ${({ theme }) => theme.colors.danger};
`;

// platform 은 서버가 enum 으로 받으므로 호스트명에서 유추한다.
const PLATFORM_BY_HOST = [
	[/(^|\.)github\.com$/, 'GITHUB'],
	[/(^|\.)velog\.io$/, 'VELOG'],
	[/(^|\.)notion\.(so|site|com)$/, 'NOTION'],
	[/(^|\.)tistory\.com$/, 'TISTORY'],
];

const parseUrl = (value) => {
	try {
		const url = new URL(value);
		// new URL 은 javascript: · ftp: 같은 것도 통과시킨다. 안내 문구대로
		// 웹 주소만 받도록 여기서 한 번 더 거른다.
		if (url.protocol !== 'http:' && url.protocol !== 'https:') return null;

		const platform = PLATFORM_BY_HOST.find(([re]) => re.test(url.hostname))?.[1] ?? 'ETC';
		return { hostname: url.hostname, platform };
	} catch {
		return null;
	}
};

const STATUS_LABEL = {
	PENDING: '수집 중',
	IN_PROGRESS: '수집 중',
	COMPLETED: '완료',
	FAILED: '실패',
};

const isCollecting = (status) => status === 'PENDING' || status === 'IN_PROGRESS';

// 수집 상태를 물어보는 주기와, 끝나지 않을 때 포기하는 시점.
// 분석·생성 폴링(5분)과 같은 상한으로 맞춰 둔다.
const SYNC_POLL_INTERVAL = 2000;
const SYNC_POLL_TIMEOUT = 5 * 60 * 1000;

function LinksPage() {
	const navigate = useNavigate();
	const isLoggedIn = useAuthStore(selectIsLoggedIn);
	const links = useCreateFlowStore((state) => state.links);
	const addLink = useCreateFlowStore((state) => state.addLink);
	const removeLink = useCreateFlowStore((state) => state.removeLink);
	const setLinks = useCreateFlowStore((state) => state.setLinks);
	const entryMode = useCreateFlowStore((state) => state.entryMode);

	// 이미 만든 사이트를 다시 연 것인지. 서버의 연동 목록은 계정에 하나뿐이라
	// 결과물별로 나뉘지 않는다 — 새로 만드는 중에 부르면 예전 결과물에 등록해 둔
	// 링크가 그대로 딸려 들어오므로, 이때만 서버 목록을 원본으로 삼는다.
	const isManagingSaved = isLoggedIn && entryMode === 'manage';

	// 재수집도 같은 조건이다. 새로 만드는 중이라면 방금 등록한 링크를 다시 긁을
	// 이유가 없어 아예 감춘다.
	const canResync = isManagingSaved;

	const [url, setUrl] = useState('');
	const [error, setError] = useState('');
	const [submitting, setSubmitting] = useState(false);
	// 서버 목록을 부르는 경우에만 처음부터 로딩으로 시작한다. 새로 만드는 중이라면
	// 아래 effect 가 그냥 빠져나가므로, true 로 두면 스피너가 걷히지 않는다.
	const [loading, setLoading] = useState(isManagingSaved);
	const showLoading = useDelayedVisible(loading);

	useEffect(() => {
		if (!isManagingSaved) return;

		getIntegrations()
			.then((items) => {
				setLinks(
					items.map((item) => ({
						// 식별자는 integrationId 로 오기도 하고 id 로 오기도 한다.
						id: item.integrationId ?? item.id,
						url: item.value,
						hostname: parseUrl(item.value)?.hostname ?? item.value,
						platform: item.platform,
						status: item.status,
					})),
				);
			})
			.catch(() => setError('연동 목록을 불러오지 못했어요.'))
			.finally(() => setLoading(false));
	}, [isManagingSaved, setLinks]);

	// 수집 중인 항목이 하나라도 있으면 끝날 때까지 상태를 물어본다.
	// 의존성에 배열을 그대로 넣으면 매 렌더 새 배열이라 문자열 키로 바꿔 비교한다.
	const collectingKey = links
		.filter((link) => isCollecting(link.status))
		.map((link) => link.id)
		.join(',');

	useEffect(() => {
		if (!isLoggedIn || !collectingKey) return undefined;

		const ids = collectingKey.split(',');
		const startedAt = Date.now();
		let timer = null;
		let stopped = false;

		// setInterval 로 두면 응답이 느릴 때 요청이 겹쳐 쌓인다.
		// 한 번 끝나고 나서 다음을 예약한다.
		const tick = async () => {
			const settled = await Promise.all(
				ids.map((id) =>
					getSyncStatus(id)
						.then((data) => [id, data.status])
						.catch(() => null),
				),
			);
			if (stopped) return;

			const nextStatus = Object.fromEntries(settled.filter(Boolean));

			// 폴링 중에 목록이 바뀌었을 수 있어 최신 상태를 스토어에서 다시 읽는다.
			setLinks(
				useCreateFlowStore
					.getState()
					.links.map((link) =>
						nextStatus[link.id] ? { ...link, status: nextStatus[link.id] } : link,
					),
			);

			// 수집이 끝나지 않으면 화면을 열어 둔 내내 물어보게 된다.
			// 일정 시간이 지나면 멈추고 사람이 다시 확인하게 안내한다.
			if (Date.now() - startedAt > SYNC_POLL_TIMEOUT) {
				setError('수집이 오래 걸리고 있어요. 잠시 후 새로고침해서 확인해 주세요.');
				return;
			}

			timer = setTimeout(tick, SYNC_POLL_INTERVAL);
		};

		timer = setTimeout(tick, SYNC_POLL_INTERVAL);

		return () => {
			stopped = true;
			clearTimeout(timer);
		};
	}, [isLoggedIn, collectingKey, setLinks]);

	const handleAdd = async (event) => {
		event.preventDefault();

		const parsed = parseUrl(url.trim());
		if (!parsed) {
			setError('https:// 로 시작하는 주소를 입력해 주세요.');
			return;
		}

		setError('');

		// 비로그인 링크는 서버에 등록되지 않아 수집이라는 과정 자체가 없다.
		// 상태 배지도 띄우지 않는다(LOCAL 은 배지 없음).
		if (!isLoggedIn) {
			addLink({ id: crypto.randomUUID(), url: url.trim(), ...parsed, status: 'LOCAL' });
			setUrl('');
			return;
		}

		setSubmitting(true);
		try {
			const created = await createIntegration({
				platform: parsed.platform,
				value: url.trim(),
			});
			addLink({
				id: created.integrationId ?? created.id,
				url: url.trim(),
				hostname: parsed.hostname,
				platform: created.platform ?? parsed.platform,
				status: created.status ?? 'PENDING',
			});
			setUrl('');
		} catch (requestError) {
			setError(messageOf(requestError, '연동 등록에 실패했어요.'));
		} finally {
			setSubmitting(false);
		}
	};

	const handleSync = async (link) => {
		setError('');

		try {
			const accepted = await syncIntegration(link.id);
			setLinks(
				links.map((item) =>
					item.id === link.id
						? { ...item, status: accepted.status ?? 'IN_PROGRESS' }
						: item,
				),
			);
		} catch (requestError) {
			setError(messageOf(requestError, '재수집 요청에 실패했어요.'));
		}
	};

	const handleRemove = async (link) => {
		if (!isLoggedIn) {
			removeLink(link.id);
			return;
		}

		try {
			await deleteIntegration(link.id);
			removeLink(link.id);
		} catch (requestError) {
			setError(messageOf(requestError, '연동 해제에 실패했어요.'));
		}
	};

	return (
		<CreateStepLayout
			step={1}
			title="URL 입력"
			description="Velog / GitHub / Notion 등 프로젝트·블로그 링크를 추가하세요"
			backTo={ROUTES.CREATE_BASIC}
			footer={
				<Button
					size="lg"
					onClick={() => navigate(ROUTES.CREATE_TEXT)}
					disabled={links.length === 0}
				>
					다음
				</Button>
			}
		>
			<AddRow onSubmit={handleAdd}>
				<Input
					type="url"
					placeholder="https://..."
					value={url}
					onChange={(event) => setUrl(event.target.value)}
					aria-label="추가할 링크 주소"
					aria-invalid={Boolean(error)}
				/>
				<Button type="submit" size="lg" disabled={submitting}>
					{submitting ? '등록 중...' : '추가'}
				</Button>
			</AddRow>

			{error && <ErrorText role="alert">{error}</ErrorText>}

			<LoadingOverlay open={showLoading} message="연동 목록을 불러오는 중이에요" />

			{!loading && links.length === 0 && <Empty>아직 추가한 링크가 없어요.</Empty>}

			{!loading && links.length > 0 && (
				<List>
					{links.map((link) => (
						<Item key={link.id}>
							<Favicon aria-hidden="true">🔗</Favicon>
							<ItemBody>
								<ItemTitle>{link.platform ?? link.hostname}</ItemTitle>
								<ItemUrl>{link.url}</ItemUrl>
							</ItemBody>
							{link.status && link.status !== 'LOCAL' && (
								<Status $done={link.status === 'COMPLETED'}>
									{STATUS_LABEL[link.status] ?? link.status}
								</Status>
							)}
							{canResync && (
								<Button
									variant="ghost"
									onClick={() => handleSync(link)}
									disabled={isCollecting(link.status)}
								>
									재수집
								</Button>
							)}
							<Button variant="ghost" onClick={() => handleRemove(link)}>
								삭제
							</Button>
						</Item>
					))}
				</List>
			)}
		</CreateStepLayout>
	);
}

export default LinksPage;
