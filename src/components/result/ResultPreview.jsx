import styled from '@emotion/styled';
import { RESULT_LABEL } from '../../constants/resultTypes';

const Sections = styled.div`
	display: flex;
	flex-direction: column;
	gap: ${({ $compact }) => ($compact ? '16px' : '24px')};
`;

const Section = styled.section`
	display: flex;
	flex-direction: column;
	gap: 10px;
`;

const SectionTitle = styled.h2`
	font-size: ${({ $compact }) => ($compact ? '15px' : '17px')};
	font-weight: 700;
`;

// 생성된 본문은 줄바꿈이 의미를 가지므로 그대로 살린다.
const SectionBody = styled.p`
	font-size: ${({ $compact }) => ($compact ? '13px' : '14px')};
	line-height: 1.7;
	color: ${({ theme }) => theme.colors.textSub};
	white-space: pre-wrap;
`;

const Block = styled.div`
	height: ${({ $height }) => $height};
	border-radius: ${({ theme }) => theme.radii.md};
	background: ${({ theme }) => theme.colors.primarySoft};
`;

const BlockRow = styled.div`
	display: grid;
	grid-template-columns: 1fr 1fr;
	gap: 20px;
`;

/**
 * 완성된 '자기소개 사이트'를 그리는 화면. 임시 결과의 전체화면 미리보기와
 * 최종 결과물 미리보기가 같은 것을 보여줘야 해서 한 컴포넌트로 묶었다.
 *
 * RESULT_LABEL 에 없는 종류(예: 예상 면접 질문)는 서버가 내려줘도 그리지 않는다.
 * 자기소개 사이트 안에 면접 질문이 섞이면 안 되기 때문.
 */
function ResultPreview({ generation, compact = false }) {
	const filled = (generation?.results ?? []).filter(
		(result) => RESULT_LABEL[result.type] && result.content?.trim(),
	);

	// 아직 생성 전이면 와이어프레임의 자리표시자를 그대로 둔다.
	if (filled.length === 0) {
		return (
			<Sections $compact={compact}>
				<Block $height={compact ? '60px' : '220px'} />
				<BlockRow>
					<Block $height={compact ? '120px' : '240px'} />
					<Block $height={compact ? '120px' : '240px'} />
				</BlockRow>
				<Block $height={compact ? '160px' : '320px'} />
				<Block $height={compact ? '160px' : '260px'} />
			</Sections>
		);
	}

	return (
		<Sections $compact={compact}>
			{filled.map((result) => (
				<Section key={result.type}>
					<SectionTitle $compact={compact}>{RESULT_LABEL[result.type]}</SectionTitle>
					<SectionBody $compact={compact}>{result.content}</SectionBody>
				</Section>
			))}
		</Sections>
	);
}

export default ResultPreview;
