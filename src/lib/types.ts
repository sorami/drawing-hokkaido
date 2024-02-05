type Stroke = {
	points: [number, number, number][];
	style: string;
	width: number;
};

type Session = {
	strokes: Stroke[];
	tStart: number;
	tEnd: number;
	blob: Blob | null;
	blobUrl: string;
};

export type { Stroke, Session };
