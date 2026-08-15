// 레코드의 날짜는 'YYYY-MM-DD'(또는 ISO datetime)로 오고, 포트폴리오 화면은
// '2025.03 — 2025.06' 한 가지 모양만 쓴다.
//
// new Date() 로 파싱하지 않는다 — 'YYYY-MM' 같은 값은 UTC 로 해석돼 타임존에 따라
// 달이 하나 밀린다. 앞의 연·월만 문자열로 잘라 쓰는 게 안전하다.

/** 'YYYY.MM' 으로 자른다. 값이 없거나 모양이 다르면 빈 문자열. */
export const formatMonth = (value) => {
	const matched = /^(\d{4})-(\d{2})/.exec(String(value ?? ''));
	return matched ? `${matched[1]}.${matched[2]}` : '';
};

/**
 * 기간 한 줄. 끝이 비어 있으면 진행 중으로 본다.
 * 구분자는 em dash — 로, 폭이 좁은 칼럼에서도 하이픈과 헷갈리지 않게 한다.
 */
export const formatPeriod = (start, end, { ongoing = '현재' } = {}) => {
	const from = formatMonth(start);
	const to = formatMonth(end);

	if (!from && !to) return '';
	if (!from) return to;
	if (from === to) return from;
	return `${from} — ${to || ongoing}`;
};
