<script lang="ts">
	import { onMount } from 'svelte';
	import * as d3 from 'd3';

	export let canvasWidth: number;
	export let canvasHeight: number;
	export let strokeWidth: number;
	export let strokeColor: string;

	type StrokeItem = {
		points: [number, number][];
		style: string;
		width: number;
	};
	let strokes: StrokeItem[] = [];

	let canvas: HTMLCanvasElement;
	let context: CanvasRenderingContext2D | null;

	onMount(() => {
		context = canvas.getContext('2d');
		if (!context) return;

		let scale = window.devicePixelRatio;
		canvas.width = Math.floor(canvasWidth * scale);
		canvas.height = Math.floor(canvasHeight * scale);
		if (context) context.scale(scale, scale);

		context.lineJoin = 'round';
		context.lineCap = 'round';

		function dragsubject() {
			const currentStroke: StrokeItem = {
				points: [],
				style: strokeColor,
				width: strokeWidth
			};
			strokes = [...strokes, currentStroke];
			return currentStroke;
		}

		function dragged({ subject, x, y }: { subject: StrokeItem; x: number; y: number }) {
			subject.points.push([x / scale, y / scale]);
			strokes = strokes;
		}

		function render() {
			if (!context) return;

			const curve = d3.curveBasis(context);

			context.clearRect(0, 0, canvasWidth, canvasHeight);
			for (const stroke of strokes) {
				context.strokeStyle = stroke.style;
				context.lineWidth = stroke.width;
				context.beginPath();
				curve.lineStart();
				for (const point of stroke.points) {
					curve.point(...point);
				}
				if (stroke.points.length === 1) curve.point(...stroke.points[0]);
				curve.lineEnd();
				context.stroke();
			}
			context.canvas.dispatchEvent(new CustomEvent('input'));
		}

		d3.select(context.canvas).call(
			d3
				.drag()
				.container(context.canvas)
				.subject(dragsubject)
				.on('start drag', dragged)
				.on('start.render drag.render', render)
		);
	});

	const clearCanvas = () => {
		if (!context) return;
		strokes = [];
		context.clearRect(0, 0, canvasWidth, canvasHeight);
	};
</script>

<div class="flex flex-col gap-4">
	<div class="b-3 b-gray-600 rounded">
		<canvas width={canvasWidth} height={canvasHeight} bind:this={canvas} />
	</div>

	<button
		class="w-24 p-1 rounded-lg font-bold flex justify-center items-center"
		on:click={clearCanvas}>Clear</button
	>
</div>
