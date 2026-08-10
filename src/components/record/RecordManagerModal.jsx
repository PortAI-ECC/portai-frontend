import { useEffect, useState } from 'react';
import styled from '@emotion/styled';
import Modal from '../common/Modal';
import Button from '../common/Button';
import Field from '../common/Field';
import Input from '../common/Input';
import Select from '../common/Select';
import Textarea from '../common/Textarea';
import Spinner from '../common/Spinner';
import { RECORD_APIS, techStacksApi } from '../../api/records';
import { generateDescription, getProject, projectsApi, uploadAttachment } from '../../api/projects';
import { messageOf } from '../../api/client';
import { RECORD_FIELDS, RECORD_ID_FIELD, RECORD_SUMMARY } from '../../constants/recordFields';

const List = styled.ul`
	display: flex;
	flex-direction: column;
	gap: 12px;
	margin-bottom: 28px;
`;

const Item = styled.li`
	display: flex;
	align-items: center;
	gap: 12px;
	padding: 14px 16px;
	background: ${({ theme }) => theme.colors.surface};
	border: 1px solid ${({ theme }) => theme.colors.border};
	border-radius: ${({ theme }) => theme.radii.lg};
`;

const ItemBody = styled.div`
	flex: 1;
	min-width: 0;
`;

const ItemTitle = styled.p`
	font-size: 15px;
	font-weight: 700;
`;

const ItemSub = styled.p`
	font-size: 13px;
	color: ${({ theme }) => theme.colors.textMuted};
	overflow: hidden;
	text-overflow: ellipsis;
	white-space: nowrap;
`;

// 기술스택 순서 재정렬용. 아이콘 대신 화살표 글자로 가볍게 둔다.
const OrderButton = styled.button`
	flex: none;
	width: 28px;
	height: 28px;
	border-radius: ${({ theme }) => theme.radii.sm};
	font-size: 13px;
	color: ${({ theme }) => theme.colors.textSub};

	&:hover:not(:disabled) {
		background: ${({ theme }) => theme.colors.primarySoft};
		color: ${({ theme }) => theme.colors.primary};
	}

	&:disabled {
		opacity: 0.3;
		cursor: not-allowed;
	}
`;

const Form = styled.form`
	display: grid;
	grid-template-columns: 1fr 1fr;
	gap: 16px;
	padding-top: 24px;
	border-top: 1px solid ${({ theme }) => theme.colors.border};
`;

// 여러 줄 입력은 두 칸을 다 쓴다.
const WideField = styled.div`
	grid-column: 1 / -1;
`;

const FormActions = styled.div`
	grid-column: 1 / -1;
	display: flex;
	justify-content: flex-end;
	gap: 12px;
`;

const CheckboxLabel = styled.label`
	display: flex;
	align-items: center;
	gap: 8px;
	height: 44px;
	font-size: 14px;
	color: ${({ theme }) => theme.colors.textSub};
`;

// 파일 선택은 label 로 감싸야 자연스러워서 Button 대신 직접 그린다.
const UploadLabel = styled.label`
	flex: none;
	display: inline-flex;
	align-items: center;
	height: 36px;
	padding: 0 16px;
	border-radius: ${({ theme }) => theme.radii.pill};
	font-size: 13px;
	font-weight: 700;
	color: ${({ theme }) => theme.colors.textSub};
	cursor: pointer;

	&:hover {
		color: ${({ theme }) => theme.colors.primary};
	}
`;

const HiddenFileInput = styled.input`
	display: none;
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

const emptyForm = (fields) =>
	Object.fromEntries(fields.map((field) => [field.name, field.type === 'checkbox' ? false : '']));

// 빈 문자열은 보내지 않는다. 서버가 "안 건드림"과 "빈 값으로 지움"을 구분하기 때문.
const toPayload = (form, fields) =>
	Object.fromEntries(
		fields
			.filter((field) => {
				const value = form[field.name];
				return field.type === 'checkbox' ? true : value !== '' && value !== undefined;
			})
			.map((field) => {
				const value = form[field.name];
				return [field.name, field.type === 'number' ? Number(value) : value];
			}),
	);

/**
 * 활동이력 6종이 공유하는 관리 모달.
 * 리소스마다 다른 것은 필드 정의(RECORD_FIELDS)와 식별자 이름뿐이라 하나로 묶었다.
 */
function RecordManagerModal({ open, categoryKey, title, onClose, onChanged }) {
	const fields = RECORD_FIELDS[categoryKey] ?? [];
	const idField = RECORD_ID_FIELD[categoryKey];
	const summary = RECORD_SUMMARY[categoryKey];
	const isProjects = categoryKey === 'projects';
	const api = isProjects ? projectsApi : RECORD_APIS[categoryKey];

	const [items, setItems] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState('');
	const [saving, setSaving] = useState(false);
	const [editingId, setEditingId] = useState(null);
	const [editLoading, setEditLoading] = useState(false);
	const [form, setForm] = useState(() => emptyForm(fields));

	// 이 모달은 열릴 때마다 새로 마운트되므로(부모가 조건부로 렌더),
	// 목록을 한 번만 받아 오면 된다. 초기화는 useState 기본값이 담당한다.
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

	const refresh = async () => {
		const data = await api.listItems();
		setItems(data);
		onChanged?.(categoryKey, data.length);
	};

	const handleSubmit = async (event) => {
		event.preventDefault();

		const required = fields.find((field) => field.required);
		if (required && !String(form[required.name] ?? '').trim()) {
			setError(`${required.label}은(는) 필수 입력값입니다.`);
			return;
		}

		setSaving(true);
		setError('');

		try {
			const payload = toPayload(form, fields);

			if (editingId === null) {
				await api.create(payload);
			} else {
				await api.update(editingId, payload);
			}

			setForm(emptyForm(fields));
			setEditingId(null);
			await refresh();
		} catch (requestError) {
			setError(messageOf(requestError, '저장에 실패했어요.'));
		} finally {
			setSaving(false);
		}
	};

	const fillForm = (source) =>
		setForm(
			Object.fromEntries(
				fields.map((field) => [
					field.name,
					source[field.name] ?? (field.type === 'checkbox' ? false : ''),
				]),
			),
		);

	const handleEdit = async (item) => {
		setEditingId(item[idField]);
		setError('');

		// 프로젝트는 목록 응답에 githubUrl 등 무거운 필드가 안 실려 오므로
		// 수정 폼을 채우기 전에 상세 조회로 나머지 필드를 받아와야 한다.
		if (!isProjects) {
			fillForm(item);
			return;
		}

		fillForm(item);
		setEditLoading(true);
		try {
			const detail = await getProject(item[idField]);
			fillForm(detail);
		} catch (requestError) {
			setError(messageOf(requestError, '프로젝트 상세 정보를 불러오지 못했어요.'));
		} finally {
			setEditLoading(false);
		}
	};

	const handleDelete = async (item) => {
		setError('');

		try {
			await api.remove(item[idField]);
			if (editingId === item[idField]) {
				setEditingId(null);
				setForm(emptyForm(fields));
			}
			await refresh();
		} catch (requestError) {
			setError(messageOf(requestError, '삭제에 실패했어요.'));
		}
	};

	// 프로젝트에만 있는 두 가지 추가 동작.
	const handleUpload = async (item, file) => {
		if (!file) return;
		setError('');

		try {
			await uploadAttachment(item[idField], file);
			await refresh();
		} catch (requestError) {
			setError(messageOf(requestError, '발표자료 업로드에 실패했어요.'));
		}
	};

	const handleGenerateDescription = async (item) => {
		setError('');
		setSaving(true);

		try {
			await generateDescription(item[idField]);
			await refresh();
		} catch (requestError) {
			setError(messageOf(requestError, 'AI 설명 생성에 실패했어요.'));
		} finally {
			setSaving(false);
		}
	};

	// 기술스택만 순서를 서버에 저장한다(PUT /api/tech-stacks/reorder).
	const handleMove = async (index, direction) => {
		const next = [...items];
		const target = index + direction;
		[next[index], next[target]] = [next[target], next[index]];

		setItems(next);
		setError('');

		try {
			await techStacksApi.reorder(next.map((item) => item[idField]));
		} catch (requestError) {
			setItems(items);
			setError(messageOf(requestError, '순서를 저장하지 못했어요.'));
		}
	};

	return (
		<Modal open={open} onClose={onClose} title={`${title} 관리`} width="820px">
			{error && <ErrorText role="alert">{error}</ErrorText>}

			{loading && <Spinner message="불러오는 중..." />}

			{!loading && items.length === 0 && <Empty>아직 등록한 항목이 없어요.</Empty>}

			{!loading && items.length > 0 && (
				<List>
					{items.map((item, index) => (
						<Item key={item[idField]}>
							{categoryKey === 'techStacks' && (
								<>
									<OrderButton
										type="button"
										onClick={() => handleMove(index, -1)}
										disabled={index === 0}
										aria-label="위로 이동"
									>
										▲
									</OrderButton>
									<OrderButton
										type="button"
										onClick={() => handleMove(index, 1)}
										disabled={index === items.length - 1}
										aria-label="아래로 이동"
									>
										▼
									</OrderButton>
								</>
							)}

							<ItemBody>
								<ItemTitle>{item[summary.title] || '이름 없음'}</ItemTitle>
								{summary.subtitle(item) && (
									<ItemSub>{summary.subtitle(item)}</ItemSub>
								)}
							</ItemBody>

							{isProjects && (
								<>
									<UploadLabel>
										발표자료
										<HiddenFileInput
											type="file"
											accept=".pdf,.ppt,.pptx,application/pdf"
											onChange={(event) =>
												handleUpload(item, event.target.files?.[0])
											}
										/>
									</UploadLabel>
									<Button
										variant="ghost"
										size="sm"
										onClick={() => handleGenerateDescription(item)}
										disabled={saving}
									>
										AI 설명
									</Button>
								</>
							)}

							<Button variant="ghost" size="sm" onClick={() => handleEdit(item)}>
								수정
							</Button>
							<Button variant="ghost" size="sm" onClick={() => handleDelete(item)}>
								삭제
							</Button>
						</Item>
					))}
				</List>
			)}

			<Form onSubmit={handleSubmit}>
				{fields.map((field) => {
					const wide = field.type === 'textarea';
					const control =
						field.type === 'textarea' ? (
							<Textarea
								id={field.name}
								value={form[field.name]}
								onChange={(event) =>
									setForm((prev) => ({
										...prev,
										[field.name]: event.target.value,
									}))
								}
							/>
						) : field.type === 'select' ? (
							<Select
								id={field.name}
								value={form[field.name]}
								onChange={(event) =>
									setForm((prev) => ({
										...prev,
										[field.name]: event.target.value,
									}))
								}
							>
								<option value="">선택 안 함</option>
								{field.options.map((option) => (
									<option key={option.value} value={option.value}>
										{option.label}
									</option>
								))}
							</Select>
						) : (
							<Input
								id={field.name}
								type={field.type ?? 'text'}
								step={field.step}
								placeholder={field.placeholder}
								value={form[field.name]}
								onChange={(event) =>
									setForm((prev) => ({
										...prev,
										[field.name]: event.target.value,
									}))
								}
							/>
						);

					if (field.type === 'checkbox') {
						return (
							<CheckboxLabel key={field.name}>
								<input
									type="checkbox"
									checked={Boolean(form[field.name])}
									onChange={(event) =>
										setForm((prev) => ({
											...prev,
											[field.name]: event.target.checked,
										}))
									}
								/>
								{field.label}
							</CheckboxLabel>
						);
					}

					const rendered = (
						<Field
							key={field.name}
							label={field.label}
							htmlFor={field.name}
							required={field.required}
						>
							{control}
						</Field>
					);

					return wide ? <WideField key={field.name}>{rendered}</WideField> : rendered;
				})}

				<FormActions>
					{editingId !== null && (
						<Button
							type="button"
							variant="secondary"
							onClick={() => {
								setEditingId(null);
								setForm(emptyForm(fields));
							}}
						>
							취소
						</Button>
					)}
					<Button type="submit" disabled={saving || editLoading}>
						{editLoading
							? '불러오는 중...'
							: saving
								? '저장 중...'
								: editingId === null
									? '추가'
									: '수정 저장'}
					</Button>
				</FormActions>
			</Form>
		</Modal>
	);
}

export default RecordManagerModal;
