import { useEffect, useRef, useState } from 'react';

/**
 * 오래 걸리는 작업에만 로딩 UI를 보여주기 위한 훅.
 *
 * active 가 true 여도 delay(ms) 동안은 아무것도 보여주지 않는다. 그 안에
 * active 가 다시 false 로 돌아오면(=응답이 빨랐다면) 로딩은 한 번도 뜨지 않는다.
 * 한 번 떴다면 minVisible(ms) 동안은 유지해, 응답이 delay 직후 바로 와도
 * 깜빡이지 않게 한다.
 *
 * 지연 여부는 어느 화면/단계인지가 아니라 실제로 걸린 시간으로만 판단한다.
 */
export function useDelayedVisible(active, { delay = 400, minVisible = 500 } = {}) {
	const [visible, setVisible] = useState(false);
	const shownAtRef = useRef(null);

	useEffect(() => {
		if (!active) return undefined;

		const timer = setTimeout(() => {
			shownAtRef.current = Date.now();
			setVisible(true);
		}, delay);

		return () => clearTimeout(timer);
	}, [active, delay]);

	useEffect(() => {
		if (active || !visible) return undefined;

		const elapsed = Date.now() - (shownAtRef.current ?? 0);
		const timer = setTimeout(() => setVisible(false), Math.max(0, minVisible - elapsed));

		return () => clearTimeout(timer);
	}, [active, visible, minVisible]);

	return visible;
}
