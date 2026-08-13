function hexToHsl(hex) {
	const value = hex.replace('#', '');
	const r = parseInt(value.substr(0, 2), 16) / 255;
	const g = parseInt(value.substr(2, 2), 16) / 255;
	const b = parseInt(value.substr(4, 2), 16) / 255;

	const max = Math.max(r, g, b);
	const min = Math.min(r, g, b);
	const l = (max + min) / 2;

	if (max === min) return [0, 0, l * 100];

	const d = max - min;
	const s = l > 0.5 ? d / (2 - max - min) : d / (max + min);

	let h;
	if (max === r) h = (g - b) / d + (g < b ? 6 : 0);
	else if (max === g) h = (b - r) / d + 2;
	else h = (r - g) / d + 4;

	return [(h / 6) * 360, s * 100, l * 100];
}

function hslToHex(hue, saturation, lightness) {
	const h = hue / 360;
	const s = saturation / 100;
	const l = lightness / 100;

	let r;
	let g;
	let b;

	if (s === 0) {
		r = l;
		g = l;
		b = l;
	} else {
		const hue2rgb = (p, q, t) => {
			let tt = t;
			if (tt < 0) tt += 1;
			if (tt > 1) tt -= 1;
			if (tt < 1 / 6) return p + (q - p) * 6 * tt;
			if (tt < 1 / 2) return q;
			if (tt < 2 / 3) return p + (q - p) * (2 / 3 - tt) * 6;
			return p;
		};

		const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
		const p = 2 * l - q;
		r = hue2rgb(p, q, h + 1 / 3);
		g = hue2rgb(p, q, h);
		b = hue2rgb(p, q, h - 1 / 3);
	}

	const toHex = (v) =>
		Math.round(v * 255)
			.toString(16)
			.padStart(2, '0');

	return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

/** 기준 색에서 명도(dl)와 채도(ds)를 상대적으로 밀어 파생 색을 만든다. */
export function adjust(hex, dl, ds = 0) {
	const [h, s, l] = hexToHsl(hex);
	return hslToHex(h, Math.max(0, Math.min(100, s + ds)), Math.max(0, Math.min(100, l + dl)));
}
