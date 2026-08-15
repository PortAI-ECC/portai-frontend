/**
 * 백엔드 응답을 화면이 기대하는 한 가지 모양으로 맞춰 주는 곳.
 *
 * 실서버에 직접 붙여 보니 문서와 실물이 두 군데서 어긋나 있었다.
 * 어느 쪽으로 정리될지 모르는 상태라, 호출부를 전부 고치는 대신
 * 여기서 양쪽을 다 받아 낸다. 백엔드가 문서대로 바꾸면 이 파일은
 * 그냥 아무 일도 하지 않게 된다.
 */

const toCamel = (key) => key.replace(/_([a-z0-9])/g, (_, char) => char.toUpperCase());

const toSnake = (key) => key.replace(/[A-Z]/g, (char) => `_${char.toLowerCase()}`);

/**
 * 응답 필드가 snake_case 로 온다(source_type, overall_status, skill_id...).
 * Swagger 와 Notion 명세서는 camelCase 라 둘이 다르다. 어느 쪽이 와도
 * 화면은 camelCase 만 쓰도록 키를 통일한다.
 */
export function camelizeKeys(value) {
	if (Array.isArray(value)) return value.map(camelizeKeys);

	// Date, File 같은 것까지 헤집지 않도록 순수 객체만 대상으로 한다.
	if (value === null || typeof value !== 'object' || value.constructor !== Object) {
		return value;
	}

	return Object.fromEntries(
		Object.entries(value).map(([key, item]) => [toCamel(key), camelizeKeys(item)]),
	);
}

/**
 * 요청 본문은 반대로 snake_case 로 보내야 한다.
 *
 * Swagger(/v3/api-docs)는 요청 스키마를 camelCase 로 그려 주지만 실물 서버는
 * snake_case 만 읽는다. 문서와 실물이 달라 실호출로만 드러난 차이다(2026-08-15 확인).
 * 게다가 증상이 필드마다 갈린다 — 필수 필드면 400, 선택 필드면 200 을 주고 조용히
 * 버린다. 한 군데서 변환해 두지 않으면 화면마다 다른 얼굴로 새어 나온다.
 *
 * 값은 건드리지 않고 키만 바꾼다. FormData·File 같은 건 그대로 흘려보낸다.
 */
export function snakeizeKeys(value) {
	if (Array.isArray(value)) return value.map(snakeizeKeys);

	if (value === null || typeof value !== 'object' || value.constructor !== Object) {
		return value;
	}

	return Object.fromEntries(
		Object.entries(value).map(([key, item]) => [toSnake(key), snakeizeKeys(item)]),
	);
}

/**
 * job-postings·generations·projects·integrations 는 { success, data, error } 봉투로
 * 감싸 오고, auth·활동이력 계열은 그대로 온다. 봉투면 알맹이만 꺼내 준다.
 *
 * success 만 보고 판단하면 실제 데이터에 success 필드가 있을 때 오작동하므로,
 * 봉투의 생김새(success 가 boolean 이고 data 나 error 를 가진 객체)를 확인한다.
 */
const isEnvelope = (body) =>
	body !== null &&
	typeof body === 'object' &&
	typeof body.success === 'boolean' &&
	('data' in body || 'error' in body);

export function unwrap(body) {
	return isEnvelope(body) ? (body.data ?? null) : body;
}

/** 응답 인터셉터가 쓰는 조합 — 키를 통일한 뒤 봉투를 벗긴다. */
export function normalizeResponse(body) {
	return unwrap(camelizeKeys(body));
}

/**
 * 목록 응답이 리소스마다 세 가지 모양으로 온다.
 *   { careers: [...] }  careers·contests·tech-stacks
 *   [ ... ]             certificates·education·activities
 *   봉투 안의 배열       projects·job-postings·generations·integrations (인터셉터가 이미 벗김)
 * 어느 쪽이 오든 배열 하나로 만들어 준다.
 */
export function listOf(body, listKey) {
	if (Array.isArray(body)) return body;
	if (Array.isArray(body?.[listKey])) return body[listKey];

	// 키 이름이 예상과 다를 수도 있어, 배열을 하나만 품고 있으면 그걸 쓴다.
	const arrays = Object.values(body ?? {}).filter(Array.isArray);
	return arrays.length === 1 ? arrays[0] : [];
}
