// Generador compartido de ilustraciones botánicas: anillos de pétalos con
// leve variación orgánica, en vez de una misma flor geométrica repetida.

export function seeded(seed: number) {
	let s = seed >>> 0;
	return () => {
		s = (s + 0x6d2b79f5) | 0;
		let t = Math.imul(s ^ (s >>> 15), 1 | s);
		t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
		return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
	};
}

export function petalPath(len: number, halfW: number, curve = 0.6) {
	const c = len * curve;
	const tipW = halfW * 0.42;
	return `M0,0 C${-halfW},${-c} ${-tipW},${-len} 0,${-len} C${tipW},${-len} ${halfW},${-c} 0,0 Z`;
}

export function leafPath(len: number, halfW: number) {
	const c = len * 0.55;
	return `M0,0 C${-halfW},${-c * 0.55} ${-halfW * 0.65},${-len * 0.85} 0,${-len} C${halfW * 0.65},${-len * 0.85} ${halfW},${-c * 0.55} 0,0 Z`;
}

export interface Ring {
	count: number;
	len: number;
	halfW: number;
	gap: number;
	curve?: number;
	jitter?: number;
}

export interface Bloom {
	cx: number;
	cy: number;
	grad: string;
	centerFill: string;
	centerDot: string;
	centerR: number;
	petals: { t: string; d: string }[];
	dotAngles: number[];
}

export function bloom(
	rand: () => number,
	opts: {
		cx: number;
		cy: number;
		rotate?: number;
		grad: string;
		centerFill?: string;
		centerDot?: string;
		centerR?: number;
		rings: Ring[];
	},
): Bloom {
	const { cx, cy, rotate = 0, grad, centerFill = '#a9701f', centerDot = '#f2b93d', centerR = 4, rings } = opts;
	const petals: { t: string; d: string }[] = [];
	rings.forEach((ring, ri) => {
		const step = 360 / ring.count;
		const stagger = ri % 2 === 1 ? step / 2 : 0;
		for (let i = 0; i < ring.count; i++) {
			const jitter = (rand() * 2 - 1) * (ring.jitter ?? 5);
			const angle = i * step + stagger + jitter + rotate;
			const lenVar = ring.len * (1 + (rand() * 2 - 1) * 0.07);
			petals.push({
				t: `translate(${cx.toFixed(1)} ${cy.toFixed(1)}) rotate(${angle.toFixed(1)}) translate(0 ${-ring.gap})`,
				d: petalPath(lenVar, ring.halfW, ring.curve),
			});
		}
	});
	const dotAngles = [0, 60, 120, 180, 240, 300].map((a) => a + rand() * 20);
	return { cx, cy, grad, centerFill, centerDot, centerR, petals, dotAngles };
}
