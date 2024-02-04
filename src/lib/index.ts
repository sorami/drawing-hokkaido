import confetti from 'canvas-confetti';

type Stroke = {
	points: [number, number, number][];
	style: string;
	width: number;
};

type Session = {
	strokes: Stroke[];
	startTime: number;
	endTime: number;
};

function doConfetti(x: number, y: number) {
	const confettiCount = 500;
	const confettiDefaults = {
		angle: 120,
		origin: { x, y }
	};
	function fire(particleRatio: number, opts: any) {
		confetti({
			...confettiDefaults,
			...opts,
			particleCount: Math.floor(confettiCount * particleRatio)
		});
	}
	fire(0.25, {
		spread: 26,
		startVelocity: 55
	});
	fire(0.2, {
		spread: 60
	});
	fire(0.35, {
		spread: 100,
		decay: 0.91,
		scalar: 0.8
	});
	fire(0.1, {
		spread: 120,
		startVelocity: 25,
		decay: 0.92,
		scalar: 1.2
	});
	fire(0.1, {
		spread: 120,
		startVelocity: 45
	});
}

export type { Stroke, Session };
export { doConfetti };
