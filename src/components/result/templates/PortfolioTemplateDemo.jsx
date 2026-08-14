import { useMemo, useState } from 'react';
import styled from '@emotion/styled';
import { EMPHASIS_OPTIONS, buildPortfolioTemplateData } from '../portfolioTemplateData';
import { SAMPLE_PORTFOLIO_RECORDS, EMPTY_PORTFOLIO_RECORDS } from '../portfolioSampleRecords';
import PortfolioPreview from '../PortfolioPreview';
import { PORTFOLIO_TEMPLATE_LIST } from './index';

// 로그인·백엔드 없이 매핑 함수(portfolioTemplateData)·6개 템플릿·PortfolioPreview 의
// 축소 렌더(panel/thumb)까지 함께 검증하는 자리.
const DATA_SOURCES = {
	sample: { label: '표본 데이터', records: SAMPLE_PORTFOLIO_RECORDS },
	empty: { label: '빈 데이터', records: EMPTY_PORTFOLIO_RECORDS },
};

const VARIANTS = ['full', 'panel', 'thumb'];

const SAMPLE_INTRO =
	'안녕하세요, 데이터 흐름을 다루는 걸 좋아하는 백엔드 개발자 김도현입니다. 문제를 구조로 먼저 이해하고, 그 구조를 코드로 옮기는 과정을 즐깁니다.';

const Bar = styled.div`
	position: sticky;
	top: 0;
	z-index: 50;
	display: flex;
	align-items: center;
	gap: 10px;
	flex-wrap: wrap;
	padding: 12px 20px;
	background: rgba(24, 22, 30, 0.92);
	backdrop-filter: blur(8px);
	color: #fff;
`;

const BarLabel = styled.span`
	font-family: 'IBM Plex Mono', monospace;
	font-size: 11px;
	letter-spacing: 0.14em;
	opacity: 0.6;
	margin-right: 4px;
`;

const Tab = styled.button`
	font: 500 13px 'Noto Sans KR', sans-serif;
	padding: 7px 14px;
	border-radius: 999px;
	cursor: pointer;
	border: 1px solid ${({ $active }) => ($active ? 'rgba(255,255,255,0.9)' : 'rgba(255,255,255,0.22)')};
	background: ${({ $active }) => ($active ? '#fff' : 'transparent')};
	color: ${({ $active }) => ($active ? '#18161e' : '#fff')};
	opacity: ${({ $active }) => ($active ? 1 : 0.72)};
	transition: all 0.16s ease;

	&:hover {
		opacity: 1;
	}
`;

const Select = styled.select`
	font-family: 'IBM Plex Mono', monospace;
	font-size: 11px;
	background: rgba(255, 255, 255, 0.1);
	color: #fff;
	border: 1px solid rgba(255, 255, 255, 0.3);
	border-radius: 999px;
	padding: 5px 10px;
`;

const PhotoToggle = styled.label`
	display: flex;
	align-items: center;
	gap: 6px;
	font-family: 'IBM Plex Mono', monospace;
	font-size: 11px;
	opacity: 0.85;
`;

function PortfolioTemplateDemo() {
	const [templateId, setTemplateId] = useState('minimal');
	const [emphasis, setEmphasis] = useState('PROJECT');
	const [showPhoto, setShowPhoto] = useState(true);
	const [dataSourceKey, setDataSourceKey] = useState('sample');
	const [variant, setVariant] = useState('full');

	const records = DATA_SOURCES[dataSourceKey].records;
	const intro = dataSourceKey === 'sample' ? SAMPLE_INTRO : '';

	const data = useMemo(
		() => buildPortfolioTemplateData({ records, basicInfo: {}, intro, emphasis }),
		[records, intro, emphasis],
	);
	const emphasisLabel = EMPHASIS_OPTIONS.find((option) => option.value === emphasis)?.label;

	return (
		<div>
			<Bar>
				<BarLabel>PORTAI · TEMPLATE</BarLabel>
				{PORTFOLIO_TEMPLATE_LIST.map((template, index) => (
					<Tab
						key={template.id}
						type="button"
						$active={templateId === template.id}
						onClick={() => setTemplateId(template.id)}
					>
						{String(index + 1).padStart(2, '0')} {template.name}
					</Tab>
				))}
				<PhotoToggle>
					<input
						type="checkbox"
						checked={showPhoto}
						onChange={(event) => setShowPhoto(event.target.checked)}
					/>
					사진
				</PhotoToggle>
				<Select
					value={dataSourceKey}
					onChange={(event) => setDataSourceKey(event.target.value)}
					aria-label="데이터 선택"
				>
					{Object.entries(DATA_SOURCES).map(([key, source]) => (
						<option key={key} value={key}>
							{source.label}
						</option>
					))}
				</Select>
				<span
					style={{
						marginLeft: 'auto',
						fontFamily: "'IBM Plex Mono', monospace",
						fontSize: 11,
						opacity: 0.55,
					}}
				>
					강조: {emphasisLabel}
				</span>
				<Select
					value={emphasis}
					onChange={(event) => setEmphasis(event.target.value)}
					aria-label="강조할 항목"
				>
					{EMPHASIS_OPTIONS.map((option) => (
						<option key={option.value} value={option.value}>
							{option.label}
						</option>
					))}
				</Select>
				<Select
					value={variant}
					onChange={(event) => setVariant(event.target.value)}
					aria-label="미리보기 변형"
				>
					{VARIANTS.map((value) => (
						<option key={value} value={value}>
							{value}
						</option>
					))}
				</Select>
			</Bar>

			<div style={{ padding: variant === 'full' ? 0 : 24, maxWidth: variant === 'thumb' ? 320 : 'none' }}>
				<PortfolioPreview
					data={data}
					templateId={templateId}
					variant={variant}
					showPhoto={showPhoto}
				/>
			</div>
		</div>
	);
}

export default PortfolioTemplateDemo;
