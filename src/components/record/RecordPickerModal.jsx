import { useEffect, useState } from 'react';
import styled from '@emotion/styled';
import Modal from '../common/Modal';
import Button from '../common/Button';
import Spinner from '../common/Spinner';
import { RECORD_APIS } from '../../api/records';
import { projectsApi } from '../../api/projects';
import { messageOf } from '../../api/client';
import { RECORD_ID_FIELD, RECORD_SUMMARY } from '../../constants/recordFields';

const List = styled.ul`
	display: flex;
	flex-direction: column;
	gap: 10px;
	margin-bottom: 24px;
`;

// 줄 전체가 체크박스 라벨이라 어디를 눌러도 선택된다.
const Row = styled.label`
	display: flex;
	align-items: center;
	gap: 12px;
	padding: 14px 16px;
	border-radius: ${({ theme }) => theme.radii.lg};
	border: 1px solid
		${({ theme, $checked }) => ($checked ? theme.colors.primary : theme.colors.border)};
	background: ${({ theme, $checked }) =>
		$checked ? theme.colors.primarySoft : theme.colors.surface};
	cursor: pointer;
	transition:
		border-color 0.15s,
		background 0.15s;
`;

const RowBody = styled.div`
	flex: 1;
	min-width: 0;
`;

const RowTitle = styled.p`
	font-size: 15px;
	font-weight: 700;
`;

const RowSub = styled.p`
	font-size: 13px;
	color: ${({ theme }) => theme.colors.textMuted};
	overflow: hidden;
	text-overflow: ellipsis;
	white-space: nowrap;
`;

const Notice = styled.p`
	margin-bottom: 20px;
	padding: 12px 14px;
	text-align: center;
	border-radius: ${({ theme }) => theme.radii.md};
	background: ${({ theme }) => theme.colors.surface};
	font-size: 13px;
	line-height: 1.6;
	color: ${({ theme }) => theme.colors.textMuted};
`;

const Empty = styled.p`
	padding: 32px 0;
	text-align: center;
	font-size: 14px;
	color: ${({ theme }) => theme.colors.textMuted};
`;

const ErrorText = styled.p`
	margin-bottom: 16px;
	font-size: 13px;
	color: ${({ theme }) => theme.colors.danger};
`;

const Actions = styled.div`
	display: flex;
	justify-content: space-between;
	align-items: center;
	gap: 12px;
`;

const Count = styled.span`
	font-size: 13px;
	color: ${({ theme }) => theme.colors.textMuted};
`;

const Buttons = styled.div`
	display: flex;
	gap: 12px;
`;

/**
 * 마이페이지에 저장해 둔 기록 중 이번 포트폴리오에 넣을 것만 골라 오는 모달.
 * 여기서는 고르기만 한다 — 내용 수정은 마이페이지의 활동이력 관리에서.
 */
function RecordPickerModal({ open, categoryKey, title, includedIds = [], onClose, onConfirm }) {
	const idField = RECORD_ID_FIELD[categoryKey];
	const summary = RECORD_SUMMARY[categoryKey];
	const api = categoryKey === 'projects' ? projectsApi : RECORD_APIS[categoryKey];

	const [items, setItems] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState('');
	const [checked, setChecked] = useState(() => new Set(includedIds));

	useEffect(() => {
		let cancelled = false;

		api.listItems()
			.then((data) => {
				if (!cancelled) setItems(data);
			})
			.catch((requestError) => {
				if (!cancelled) setError(messageOf(requestError, '목록을 불러오지 못했어요.'));
			})
			.finally(() => {
				if (!cancelled) setLoading(false);
			});

		return () => {
			cancelled = true;
		};
	}, [api]);

	const toggle = (id) =>
		setChecked((prev) => {
			const next = new Set(prev);
			if (next.has(id)) {
				next.delete(id);
			} else {
				next.add(id);
			}
			return next;
		});

	const handleConfirm = () => onConfirm(items.filter((item) => checked.has(item[idField])));

	return (
		<Modal
			open={open}
			onClose={onClose}
			title={`저장된 ${title} 불러오기`}
			width="640px"
			closeOnBackdrop={false}
		>
			<Notice>
				여기서는 고르기만 할 수 있어요. 내용 수정은 마이페이지 &gt; 활동이력 관리에서
				가능해요.
			</Notice>

			{error && <ErrorText role="alert">{error}</ErrorText>}

			{loading && <Spinner message="불러오는 중..." />}

			{!loading && !error && items.length === 0 && (
				<Empty>마이페이지에 저장해 둔 {title} 기록이 아직 없어요.</Empty>
			)}

			{!loading && items.length > 0 && (
				<List>
					{items.map((item) => {
						const id = item[idField];
						const isChecked = checked.has(id);

						return (
							<Row key={id} $checked={isChecked}>
								<input
									type="checkbox"
									checked={isChecked}
									onChange={() => toggle(id)}
								/>
								<RowBody>
									<RowTitle>{item[summary.title] || '이름 없음'}</RowTitle>
									{summary.subtitle(item) && (
										<RowSub>{summary.subtitle(item)}</RowSub>
									)}
								</RowBody>
							</Row>
						);
					})}
				</List>
			)}

			<Actions>
				<Count>{checked.size > 0 ? `${checked.size}개 선택됨` : '선택한 항목 없음'}</Count>
				<Buttons>
					<Button type="button" variant="secondary" onClick={onClose}>
						취소
					</Button>
					<Button type="button" onClick={handleConfirm} disabled={loading}>
						선택 완료
					</Button>
				</Buttons>
			</Actions>
		</Modal>
	);
}

export default RecordPickerModal;
