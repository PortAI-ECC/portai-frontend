import { useCallback, useEffect, useRef, useState } from 'react';

const STAGES = [
	{ until: 25, message: '입력한 내용을 정리하는 중' },
	{ until: 55, message: '프로젝트 설명을 생성하는 중' },
	{ until: 80, message: '직무에 맞춰 문장을 다듬는 중' },
	{ until: 100, message: '결과 페이지를 구성하는 중' },
];

/**
 * 생성 진행률을 0~100 으로 돌려준다.
 *
 * 백엔드에 진행률 조회 엔드포인트가 아직 없어서, 지금은 로컬 타이머로 값을 올린다.
 * 멘토 피드백대로 2초 간격 폴링이 붙으면 tick 안을 API 응답값으로 바꾸면 된다.
 */
export function useGenerationProgress(onDone) {
	const [running, setRunning] = useState(false);
	const [value, setValue] = useState(0);
	// 콜백이 매 렌더 새로 만들어져도 타이머가 재시작되지 않도록 ref 로 붙잡아 둔다.
	const doneRef = useRef(onDone);

	useEffect(() => {
		doneRef.current = onDone;
	}, [onDone]);

	const start = useCallback(() => {
		setValue(0);
		setRunning(true);
	}, []);

	useEffect(() => {
		if (!running) return undefined;

		const timer = setInterval(() => {
			setValue((prev) => {
				const next = prev + Math.random() * 12 + 4;

				if (next >= 100) {
					clearInterval(timer);
					setRunning(false);
					doneRef.current?.();
					return 100;
				}

				return next;
			});
		}, 450);

		return () => clearInterval(timer);
	}, [running]);

	const message = STAGES.find((stage) => value <= stage.until)?.message ?? '';

	return { running, value, message, start };
}
