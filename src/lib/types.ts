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

export type { Stroke, Session };
