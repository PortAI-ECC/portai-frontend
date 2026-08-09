import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from '@emotion/styled';
import CreateStepLayout from '../../components/layout/CreateStepLayout';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import { ROUTES } from '../../constants/routes';
import { useCreateFlowStore } from '../../store/createFlowStore';

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
	overflow: hidden;
	text-overflow: ellipsis;
	white-space: nowrap;
`;

const ItemUrl = styled.p`
	font-size: 13px;
	color: ${({ theme }) => theme.colors.textMuted};
	overflow: hidden;
	text-overflow: ellipsis;
	white-space: nowrap;
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

const hostnameOf = (value) => {
	try {
		return new URL(value).hostname;
	} catch {
		return null;
	}
};

function LinksPage() {
	const navigate = useNavigate();
	const links = useCreateFlowStore((state) => state.links);
	const addLink = useCreateFlowStore((state) => state.addLink);
	const removeLink = useCreateFlowStore((state) => state.removeLink);

	const [url, setUrl] = useState('');
	const [error, setError] = useState('');

	const handleAdd = (event) => {
		event.preventDefault();
		const hostname = hostnameOf(url.trim());

		if (!hostname) {
			setError('https:// 로 시작하는 주소를 입력해 주세요.');
			return;
		}

		addLink({ id: crypto.randomUUID(), url: url.trim(), hostname });
		setUrl('');
		setError('');
	};

	return (
		<CreateStepLayout
			step={1}
			title="URL 입력"
			description="Velog / GitHub / Notion 등 프로젝트·블로그 링크를 추가하세요"
			footer={
				<Button size="lg" onClick={() => navigate(ROUTES.CREATE_TEXT)}>
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
				<Button type="submit" size="lg">
					추가
				</Button>
			</AddRow>

			{error && <ErrorText role="alert">{error}</ErrorText>}

			{links.length === 0 ? (
				<Empty>아직 추가한 링크가 없어요.</Empty>
			) : (
				<List>
					{links.map((link) => (
						<Item key={link.id}>
							<Favicon aria-hidden="true">🔗</Favicon>
							<ItemBody>
								<ItemTitle>{link.hostname}</ItemTitle>
								<ItemUrl>{link.url}</ItemUrl>
							</ItemBody>
							<Button variant="ghost" onClick={() => removeLink(link.id)}>
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
