// 연락처는 서버·화면 모두 '010-1234-5678' 한 가지 모양만 쓴다.
// 사용자는 하이픈 없이도, 아무 데나 넣어서도 치기 때문에 숫자만 남겨 다시 끊는다.

/** 숫자만 남기고 국내 휴대폰/유선 자릿수에 맞춰 하이픈을 넣는다. */
export const formatPhone = (value) => {
	const digits = String(value ?? '')
		.replace(/\D/g, '')
		.slice(0, 11);

	if (digits.length < 4) return digits;
	if (digits.length < 8) return `${digits.slice(0, 3)}-${digits.slice(3)}`;
	// 10자리(011-123-4567)와 11자리(010-1234-5678)는 가운데 토막 길이가 다르다.
	if (digits.length === 10) {
		return `${digits.slice(0, 3)}-${digits.slice(3, 6)}-${digits.slice(6)}`;
	}
	return `${digits.slice(0, 3)}-${digits.slice(3, 7)}-${digits.slice(7)}`;
};

/** '010' 처럼 자릿수가 모자란 값을 통과시키지 않기 위한 검사. */
export const isValidPhone = (value) => /^\d{2,3}-\d{3,4}-\d{4}$/.test(formatPhone(value));

export const PHONE_MESSAGE = '연락처를 010-0000-0000 형식으로 입력해 주세요.';
