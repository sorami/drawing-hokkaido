type Point = {
	x: number;
	y: number;
	t: number;
};

type Stroke = {
	points: Point[];
	style: string;
	width: number;
};

type Session = {
	strokes: Stroke[];
	time: { startedAt: Date; endedAt: Date };
	canvasSize: { width: number; height: number };
	blob: Blob | null;
	blobUrl: string;
};

type ModeOptions = 'init' | 'draw' | 'log' | 'replay';

export type { Stroke, Session, ModeOptions };
