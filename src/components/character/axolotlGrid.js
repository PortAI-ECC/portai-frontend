import { adjust } from '../../utils/color';

export const COLS = 27;
export const ROWS = 25;

const CX = 13;
const CY = 12;
const R = 9;

// 세로 위치 y 에서 몸통 반너비. 원을 도트로 근사한다.
const halfWidthAt = (y) => {
	const dy = Math.abs(y - CY);
	if (dy > R) return -1;
	return Math.floor(Math.sqrt(R * R - dy * dy));
};

/**
 * 우파루파 도트 캐릭터의 심볼 격자를 만든다.
 * 각 칸의 글자는 팔레트 키다: O 외곽선, P 몸통, L 밝은 위쪽, D 어두운 아래쪽,
 * K 눈, B 볼, G/H 아가미, W 하이라이트, '.' 투명.
 */
export function buildGrid() {
	const grid = Array.from({ length: ROWS }, () => Array(COLS).fill('.'));

	for (let y = 3; y <= 21; y += 1) {
		const hw = halfWidthAt(y);
		if (hw < 0) continue;

		for (let x = CX - hw; x <= CX + hw; x += 1) {
			if (x === CX - hw || x === CX + hw) grid[y][x] = 'O';
			else if (y <= CY - 3) grid[y][x] = 'L';
			else if (y >= CY + 5) grid[y][x] = 'D';
			else grid[y][x] = 'P';
		}
	}

	for (const ex of [CX - 5, CX - 4, CX + 4, CX + 5]) {
		grid[11][ex] = 'K';
		grid[12][ex] = 'K';
	}

	grid[15][CX - 2] = 'O';
	grid[16][CX - 1] = 'O';
	grid[16][CX] = 'O';
	grid[16][CX + 1] = 'O';
	grid[15][CX + 2] = 'O';

	for (const bx of [CX - 7, CX - 6, CX + 6, CX + 7]) {
		grid[13][bx] = 'B';
		grid[14][bx] = 'B';
	}

	// 우파루파의 상징인 아가미 술
	for (const gy of [6, 8, 10]) {
		const hw = halfWidthAt(gy);
		for (let i = 0; i < 3; i += 1) {
			const key = i < 2 ? 'G' : 'H';
			const rx = CX + hw + 1 + i;
			const lx = CX - hw - 1 - i;
			grid[gy][rx] = key;
			grid[gy + 1][rx] = key;
			grid[gy][lx] = key;
			grid[gy + 1][lx] = key;
		}
	}

	for (const lx0 of [CX - 6, CX + 5]) {
		for (let dx = 0; dx < 2; dx += 1) {
			for (let y = 20; y <= 22; y += 1) {
				grid[y][lx0 + dx] = y === 22 ? 'O' : 'D';
			}
		}
	}

	grid[5][CX - 4] = 'W';
	grid[5][CX - 3] = 'W';
	grid[6][CX - 4] = 'W';

	return grid;
}

/** 기준 색 하나에서 캐릭터 팔레트 전체를 파생한다. */
export function buildPalette(base) {
	return {
		'.': null,
		O: adjust(base, -38, 10),
		P: base,
		D: adjust(base, -14),
		L: adjust(base, 16, -5),
		W: '#fff7fa',
		K: '#241018',
		G: adjust(base, 8, 5),
		H: adjust(base, 30, -10),
		B: adjust(base, -6, 20),
	};
}
