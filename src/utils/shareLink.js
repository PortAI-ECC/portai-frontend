// 공개 포트폴리오는 조회 API 없이 링크 하나로 완결된다 — slug 안에 결과물을 통째로
// 압축해 넣고, /u/:slug 가 그걸 풀어서 렌더한다. 그래서 링크는 발급 시점의 스냅샷이며,
// 원본을 나중에 고쳐도 이미 공유된 링크는 옛 내용을 그대로 보여준다.
//
// 압축은 브라우저 내장 CompressionStream(deflate-raw)을 쓴다. 내용이 대부분 한글이라
// UTF-8 바이트를 deflate 하는 쪽이 문자 단위로 압축하는 lz-string 류보다 20% 넘게 짧다.
// 주소 길이가 이 기능의 유일한 실패 지점이라 그 차이가 그대로 여유분이 된다.
//
// 앞의 'v1' 은 포맷 표식이다. 나중에 담는 내용이 바뀌어도 이미 뿌려진 링크를
// 구분해서 처리할 수 있고, 예전 하드코딩 주소(/u/username)처럼 우리가 만든 게
// 아닌 slug 를 디코딩 전에 걸러낸다.
const FORMAT_PREFIX = 'v1';

// 브라우저와 호스팅(Netlify)이 실제로 견디는 주소 길이의 보수적인 하한선이다.
// 이걸 넘으면 링크가 잘려 열리지 않으므로 조용히 실패하지 않고 화면에 알린다.
export const SHARE_URL_LIMIT = 8000;

async function pipeThrough(stream, bytes) {
	const writer = stream.writable.getWriter();
	// 잘린 주소처럼 내용이 깨졌으면 읽기·쓰기 양쪽 promise 가 따로 거부된다.
	// 오류는 아래 읽기 쪽에서 받아 호출부로 넘기므로, 쓰기 쪽은 삼켜서
	// 처리되지 않은 거부가 콘솔에 남지 않게 한다.
	writer.write(bytes).catch(() => {});
	writer.close().catch(() => {});
	return new Uint8Array(await new Response(stream.readable).arrayBuffer());
}

// base64 를 주소에 그대로 실을 수 있게 +/= 를 URL-safe 문자로 바꾼다.
function toBase64Url(bytes) {
	let binary = '';
	bytes.forEach((byte) => {
		binary += String.fromCharCode(byte);
	});
	return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

function fromBase64Url(text) {
	const binary = atob(text.replace(/-/g, '+').replace(/_/g, '/'));
	return Uint8Array.from(binary, (char) => char.charCodeAt(0));
}

export async function encodePortfolioSlug({ data, templateId }) {
	const json = new TextEncoder().encode(JSON.stringify({ data, templateId }));
	const compressed = await pipeThrough(new CompressionStream('deflate-raw'), json);
	return FORMAT_PREFIX + toBase64Url(compressed);
}

export async function decodePortfolioSlug(slug) {
	if (typeof slug !== 'string' || !slug.startsWith(FORMAT_PREFIX)) return null;

	try {
		const compressed = fromBase64Url(slug.slice(FORMAT_PREFIX.length));
		const json = await pipeThrough(new DecompressionStream('deflate-raw'), compressed);
		const { data, templateId } = JSON.parse(new TextDecoder().decode(json));
		if (!data) return null;

		return { data, templateId };
	} catch {
		return null;
	}
}
