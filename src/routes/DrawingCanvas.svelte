<script lang="ts">
	import * as d3 from 'd3';
	import { onMount } from 'svelte';
	import type { Stroke } from '$lib/types';
	import { randomHexColor } from '$lib/utils';

	export let canvasWidth: number;
	export let canvasHeight: number;
	export let strokeWidth: number;
	export let strokeColor: string;

	export let strokes: Stroke[];

	let canvas: HTMLCanvasElement;
	let context: CanvasRenderingContext2D | null;

	export function hasCanvas() {
		return !!canvas;
	}
	export function setCanvasGlobalAlpha(alpha: number) {
		if (!context) return;
		context.globalAlpha = alpha;
	}

	onMount(() => {
		context = canvas.getContext('2d');
		if (!context) return;

		context.lineJoin = 'round';
		context.lineCap = 'round';

		function dragsubject() {
			const currStroke: Stroke = {
				points: [],
				style: strokeColor,
				width: strokeWidth
			};
			strokes = [...strokes, currStroke];
			return currStroke;
		}

		function dragged({ subject, x, y }: { subject: Stroke; x: number; y: number }) {
			subject.points.push([x, y, Date.now()]);
			strokes = strokes;
		}

		d3.select(context.canvas).call(
			// @ts-ignore
			d3
				.drag()
				.container(context.canvas)
				.subject(dragsubject)
				.on('start drag', dragged)
				.on('start.render drag.render', render)
		);
	});

	export function drawStrokes(thisStrokes: Stroke[], globalAlpha = 1) {
		if (!context) return;
		const curve = d3.curveBasis(context);

		context.globalAlpha = globalAlpha;

		for (const stroke of thisStrokes) {
			context.strokeStyle = randomHexColor(); //stroke.style;
			context.lineWidth = stroke.width;
			context.beginPath();
			curve.lineStart();
			for (const point of stroke.points) {
				curve.point(point[0], point[1]);
			}
			if (stroke.points.length === 1) curve.point(stroke.points[0][0], stroke.points[0][1]);
			curve.lineEnd();
			context.stroke();
		}

		context.globalAlpha = 1;

		context.canvas.dispatchEvent(new CustomEvent('input'));
	}

	export function render() {
		if (!context) return;
		context.clearRect(0, 0, canvasWidth, canvasHeight);

		const curve = d3.curveBasis(context);

		for (const stroke of strokes) {
			context.strokeStyle = stroke.style;
			context.lineWidth = stroke.width;
			context.beginPath();
			curve.lineStart();
			for (const point of stroke.points) {
				curve.point(point[0], point[1]);
			}
			if (stroke.points.length === 1) curve.point(stroke.points[0][0], stroke.points[0][1]);
			curve.lineEnd();
			context.stroke();
		}
		context.canvas.dispatchEvent(new CustomEvent('input'));
	}

	export function clear() {
		if (!context) return;
		strokes = [];
		context.clearRect(0, 0, canvasWidth, canvasHeight);
	}
</script>

<div class="flex flex-col gap-4">
	<div class="b-4 b-gray-600 rounded-lg">
		<canvas width={canvasWidth} height={canvasHeight} bind:this={canvas} />
	</div>
</div>
