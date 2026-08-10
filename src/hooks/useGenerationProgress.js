import { useCallback, useEffect, useRef, useState } from 'react';
import { getGeneration } from '../api/generations';
import { isSettled, pollUntil } from '../api/poll';
import { messageOf } from '../api/client';

// 결과물 종류별로 지금 뭘 하고 있는지 보여준다.
// (DB 명세서 generation_results.type ENUM 과 같은 키)
const STAGE_MESSAGE = {
	SELF_INTRODUCTION: '자기소개를 정리하는 중',
	RESUME: '이력서를 작성하는 중',
	PORTFOLIO: '포트폴리오를 구성하는 중',
	PROJECT_INTRO: '프로젝트 설명을 다듬는 중',
	INTERVIEW_QUESTIONS: '예상 면접 질문을 만드는 중',
};

// 진행률은 '끝난 결과물 / 전체 결과물'. 아직 하나도 안 끝났어도 막대가
// 완전히 비어 보이지 않도록 5% 를 바닥으로 둔다.
const percentOf = (generation) => {
	const results = generation?.results ?? [];
	if (results.length === 0) return isSettled(generation?.overallStatus) ? 100 : 5;

	const done = results.filter((result) => result.status !== 'IN_PROGRESS').length;
	return Math.max(5, Math.round((done / results.length) * 100));
};

const stageMessageOf = (generation) => {
	const pending = generation?.results?.find((result) => result.status === 'IN_PROGRESS');
	return pending ? (STAGE_MESSAGE[pending.type] ?? '결과물을 만드는 중') : '마무리하는 중';
};

/**
 * 결과물 생성 진행률을 0~100 으로 돌려준다.
 *
 * 생성 요청은 202 로 접수만 되고 결과는 나중에 채워지므로,
 * GET /api/generations/{id} 를 2초 간격으로 물어보며 진행률을 만든다.
 */
export function useGenerationProgress() {
	const [running, setRunning] = useState(false);
	const [value, setValue] = useState(0);
	const [message, setMessage] = useState('');
	const [error, setError] = useState('');
	const abortRef = useRef(null);

	// 화면을 떠나면 폴링을 끊는다.
	useEffect(() => () => abortRef.current?.abort(), []);

	/**
	 * kickoff 은 generationId 를 돌려주는 함수다.
	 * (생성 요청이든 재생성 요청이든 그 뒤 폴링은 똑같다.)
	 * 끝까지 간 경우에만 generation 을 돌려주고, 실패·취소면 null.
	 */
	const track = useCallback(async (kickoff) => {
		abortRef.current?.abort();
		const controller = new AbortController();
		abortRef.current = controller;

		setRunning(true);
		setValue(5);
		setMessage('입력한 내용을 정리하는 중');
		setError('');

		try {
			const generationId = await kickoff();

			const finished = await pollUntil(
				async () => {
					const generation = await getGeneration(generationId);
					setValue(percentOf(generation));
					setMessage(stageMessageOf(generation));
					return generation;
				},
				(generation) => isSettled(generation.overallStatus),
				{ signal: controller.signal },
			);

			setValue(100);
			return finished;
		} catch (requestError) {
			if (requestError?.name === 'AbortError') return null;

			setError(
				requestError?.message === 'TIMEOUT'
					? '생성이 오래 걸리고 있어요. 잠시 후 다시 시도해 주세요.'
					: messageOf(requestError, '결과물 생성에 실패했어요.'),
			);
			return null;
		} finally {
			if (!controller.signal.aborted) setRunning(false);
		}
	}, []);

	return { running, value, message, error, track, setError };
}
