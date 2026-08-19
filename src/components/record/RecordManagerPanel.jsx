import { useEffect, useState } from 'react';
import styled from '@emotion/styled';
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
import { selectIsLoggedIn, useAuthStore } from '../../store/authStore';
import { visuallyHidden } from '../../styles/controlStyle';
import RecordPickerModal from './RecordPickerModal';

// 위 여백은 불러오기 버튼 줄이 아니라 목록·빈 문구 쪽이 갖는다.
// 그래야 빈 문구를 버튼 아래와 폼 구분선 사이 한가운데 놓을 수 있다.
const List = styled.ul`
	display: flex;
	flex-direction: column;
	gap: 12px;
	margin: 24px 0 28px;
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

// 체크박스는 라벨이 없어 44px 입력칸보다 낮다. 옆에 놓인 입력칸과
// 아래끝을 맞추려면 라벨 높이만큼 밀어 줘야 한다.
const AlignedCheckboxLabel = styled(CheckboxLabel)`
	align-self: end;
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

	/* 감춰 둔 입력이 탭으로 포커스를 받으면 이 라벨에 테두리를 그려 준다. */
	&:focus-within {
		outline: 2px solid ${({ theme }) => theme.colors.primary};
		outline-offset: 2px;
	}
`;

const HiddenFileInput = styled.input`
	${visuallyHidden}
`;

const Empty = styled.p`
	text-align: center;
	font-size: 14px;
	color: ${({ theme }) => theme.colors.textMuted};
`;

const ErrorText = styled.p`
	margin-bottom: 16px;
	font-size: 13px;
	color: ${({ theme }) => theme.colors.danger};
`;

// 불러오기 버튼은 오른쪽 끝에 붙인다. 아래 여백은 뒤따르는 목록·빈 문구가 갖는다.
const LoadRow = styled.div`
	display: flex;
	justify-content: flex-end;
`;

// 아직 아무것도 없을 때는 버튼이 자리를 차지하지 않게 띄워 두고,
// 빈 문구를 '버튼 위 ~ 폼 구분선' 구간 한가운데 놓는다.
const EmptyArea = styled.div`
	position: relative;
	display: flex;
	align-items: center;
	justify-content: center;
	min-height: 116px;
`;

const FloatingLoadRow = styled.div`
	position: absolute;
	top: 0;
	right: 0;
`;

// 목록에서 빼는 단추. 글자 대신 마이너스 기호만 두되,
// 가는 획은 잘 안 보여서 막대를 직접 그린다.
const RemoveButton = styled.button`
	flex: none;
	display: flex;
	align-items: center;
	justify-content: center;
	width: 28px;
	height: 28px;
	border-radius: ${({ theme }) => theme.radii.sm};
	color: ${({ theme }) => theme.colors.textSub};

	&::before {
		content: '';
		width: 13px;
		height: 2.5px;
		border-radius: 2px;
		background: currentColor;
	}

	&:hover {
		background: ${({ theme }) => theme.colors.primarySoft};
		color: ${({ theme }) => theme.colors.primary};
	}
`;

// 자유 서술이라 기본 입력칸(110px)보다 넉넉히 높게 둔다.
const FreeTextarea = styled(Textarea)`
	min-height: 180px;
`;

// 자유 텍스트는 아직 서버로 보내지 않는다. 백엔드가 기존 등록 API(REQ-010~015)의
// request body 에 이 필드를 추가해 배포하면 그때 toPayload 에 포함시킨다.
const FREE_TEXT_NAME = '__freeText';

// '기타'는 '활동'(description) 이 이미 자유 서술 칸이라 중복으로 두지 않는다.
const CATEGORIES_WITHOUT_FREE_TEXT = new Set(['activities', 'projects']);

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
 * 활동이력 6종 + 프로젝트가 공유하는 목록·등록 폼.
 * 리소스마다 다른 것은 필드 정의(RECORD_FIELDS)와 식별자 이름뿐이라 하나로 묶었다.
 *
 * variant='manage' — 마이페이지. 열면 바로 목록을 불러오고 수정까지 할 수 있다.
 * variant='create' — 포트폴리오 생성 위저드. 목록을 통째로 불러오지 않고,
 *   '저장된 기록 불러오기'로 고른 것과 여기서 새로 추가한 것만 보여준다.
 *   수정은 마이페이지에서만 하도록 여기선 빼기(목록에서 제외)만 남긴다.
 */
function RecordManagerPanel({ categoryKey, title = '기록', variant = 'manage', onChanged }) {
	const isCreate = variant === 'create';
	const isLoggedIn = useAuthStore(selectIsLoggedIn);
	const fields = RECORD_FIELDS[categoryKey] ?? [];
	const idField = RECORD_ID_FIELD[categoryKey];
	const summary = RECORD_SUMMARY[categoryKey];
	const isProjects = categoryKey === 'projects';
	const api = isProjects ? projectsApi : RECORD_APIS[categoryKey];
	const showFreeText = isCreate && !CATEGORIES_WITHOUT_FREE_TEXT.has(categoryKey);

	// 생성 단계에서는 사용자가 고른 것 + 여기서 새로 추가한 것만 담긴다.
	const [items, setItems] = useState([]);
	const [loading, setLoading] = useState(!isCreate);
	const [error, setError] = useState('');
	const [saving, setSaving] = useState(false);
	const [editingId, setEditingId] = useState(null);
	const [editLoading, setEditLoading] = useState(false);
	const [pickerOpen, setPickerOpen] = useState(false);
	const [form, setForm] = useState(() => emptyForm(fields));
	const [freeText, setFreeText] = useState('');

	// 마이페이지에서 열 때만 마운트 즉시 목록을 받는다.
	// 생성 단계는 아래 handleLoadList 로 사용자가 직접 부른다.
	useEffect(() => {
		if (isCreate) return undefined;

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
	}, [api, isCreate]);

	const refresh = async () => {
		const data = await api.listItems();
		setItems(data);
		onChanged?.(categoryKey, data.length);
	};

	// 모달에서 고른 기록만 목록에 앉힌다. 서버 데이터는 건드리지 않는다.
	const handlePicked = (picked) => {
		setPickerOpen(false);
		setItems(picked);
		onChanged?.(categoryKey, picked.length);
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

			if (editingId !== null) {
				await api.update(editingId, payload);
				await refresh();
			} else {
				const created = await api.create(payload);

				if (!isCreate) {
					await refresh();
				} else {
					// 등록 응답은 { contestId, message } 처럼 식별자와 안내문뿐이라
					// 그대로 목록에 넣으면 '이름 없음'으로 보인다. 목록을 다시 받아
					// 방금 만든 항목을 찾아서, 골라 둔 기록 뒤에 붙인다.
					const newId = created?.[idField];
					const all = await api.listItems();
					const added = all.find((entry) => entry[idField] === newId);
					const next = added ? [...items, added] : all;

					setItems(next);
					onChanged?.(categoryKey, next.length);
				}
			}

			setForm(emptyForm(fields));
			setFreeText('');
			setEditingId(null);
		} catch (requestError) {
			// TODO(백엔드 대기): 비로그인이면 여기서 반드시 실패한다.
			// 활동이력 API 6종은 전부 인증이 필요해 게스트는 403 을 받는다.
			// POST /api/auth/guest 로 토큰을 받아도 데이터 API 는 404 USER_NOT_FOUND 라
			// (2026-08-20 실측) 지금은 프론트에서 풀 방법이 없다.
			// 게스트 토큰이 데이터 API 에서 동작하게 되면 이 분기는 사라져도 된다.
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

	// 생성 단계의 '빼기'는 이번 포트폴리오 목록에서만 제외한다.
	// 저장된 기록 자체를 지우는 건 마이페이지의 활동이력 관리에서만 할 수 있다.
	const handleExclude = (item) => {
		const next = items.filter((entry) => entry[idField] !== item[idField]);
		setItems(next);
		onChanged?.(categoryKey, next.length);
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

	// 저장된 기록은 계정에 딸려 있어 로그인했을 때만 불러올 수 있다.
	// 입력 자체는 비로그인도 열어 둔다.
	const loadButton = isCreate && isLoggedIn && (
		<Button variant="secondary" size="sm" onClick={() => setPickerOpen(true)}>
			저장된 기록 불러오기
		</Button>
	);

	const isEmpty = !loading && !error && items.length === 0;

	return (
		<>
			{error && <ErrorText role="alert">{error}</ErrorText>}

			{/* 목록이 비었을 때만 버튼을 띄워 두고 문구를 구간 한가운데 놓는다.
			    비로그인은 불러올 것도 등록해 둔 것도 없으니 빈 문구 자체를 감춘다. */}
			{isEmpty ? (
				loadButton ? (
					<EmptyArea>
						<FloatingLoadRow>{loadButton}</FloatingLoadRow>
						<Empty>아직 등록한 항목이 없어요.</Empty>
					</EmptyArea>
				) : (
					!isCreate && <Empty>아직 등록한 항목이 없어요.</Empty>
				)
			) : (
				loadButton && <LoadRow>{loadButton}</LoadRow>
			)}

			{loading && <Spinner message="불러오는 중..." />}

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
								{summary.subtitle(item) && <ItemSub>{summary.subtitle(item)}</ItemSub>}
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

							{/* 수정은 마이페이지의 활동이력 관리에서만 한다. */}
							{!isCreate && (
								<Button variant="ghost" size="sm" onClick={() => handleEdit(item)}>
									수정
								</Button>
							)}
							{isCreate ? (
								<RemoveButton
									type="button"
									onClick={() => handleExclude(item)}
									aria-label={`${item[summary.title] || '항목'} 목록에서 빼기`}
									title="목록에서 빼기"
								/>
							) : (
								<Button variant="ghost" size="sm" onClick={() => handleDelete(item)}>
									삭제
								</Button>
							)}
						</Item>
					))}
				</List>
			)}

			<Form onSubmit={handleSubmit}>
				{fields.map((field) => {
					const wide = field.type === 'textarea' || field.wide;
					const control =
						field.type === 'textarea' ? (
							<Textarea
								id={field.name}
								value={form[field.name]}
								onChange={(event) =>
									setForm((prev) => ({ ...prev, [field.name]: event.target.value }))
								}
							/>
						) : field.type === 'select' ? (
							<Select
								id={field.name}
								value={form[field.name]}
								onChange={(event) =>
									setForm((prev) => ({ ...prev, [field.name]: event.target.value }))
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
									setForm((prev) => ({ ...prev, [field.name]: event.target.value }))
								}
							/>
						);

					if (field.type === 'checkbox') {
						return (
							<AlignedCheckboxLabel key={field.name}>
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
							</AlignedCheckboxLabel>
						);
					}

					const rendered = (
						<Field key={field.name} label={field.label} htmlFor={field.name} required={field.required}>
							{control}
						</Field>
					);

					return wide ? <WideField key={field.name}>{rendered}</WideField> : rendered;
				})}

				{showFreeText && (
					<WideField>
						<Field label="자유 텍스트" htmlFor={FREE_TEXT_NAME}>
							<FreeTextarea
								id={FREE_TEXT_NAME}
								value={freeText}
								onChange={(event) => setFreeText(event.target.value)}
								placeholder="위 항목으로 담기 어려운 내용을 자유롭게 적어 주세요."
							/>
						</Field>
					</WideField>
				)}

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

			{pickerOpen && (
				<RecordPickerModal
					open
					categoryKey={categoryKey}
					title={title}
					includedIds={items.map((item) => item[idField])}
					onClose={() => setPickerOpen(false)}
					onConfirm={handlePicked}
				/>
			)}
		</>
	);
}

export default RecordManagerPanel;
