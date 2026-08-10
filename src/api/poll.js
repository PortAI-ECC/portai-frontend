/**
 * 서버가 PENDING/IN_PROGRESS 로 먼저 답하고 나중에 끝나는 작업(채용공고 분석,
 * 결과물 생성)을 위해 끝날 때까지 같은 요청을 반복한다.
 *
 * 멘토 피드백대로 기본 간격은 2초. 화면을 떠나면 signal 로 끊는다.
 */
export async function pollUntil(fetcher, isDone, { interval = 2000, timeout = 90000, signal } = {}) {
	const startedAt = Date.now();

	for (;;) {
		if (signal?.aborted) throw new DOMException('Aborted', 'AbortError');

		const data = await fetcher();
		if (isDone(data)) return data;

		if (Date.now() - startedAt > timeout) {
			throw new Error('TIMEOUT');
		}

		await new Promise((resolve) => setTimeout(resolve, interval));
	}
}

/** 분석·생성 계열이 공통으로 쓰는 '이제 안 변한다' 판정. */
export const isSettled = (status) =>
	status === 'COMPLETED' || status === 'FAILED' || status === 'PARTIALLY_COMPLETED';
