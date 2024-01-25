<script lang="ts">
	import '@unocss/reset/tailwind-compat.css';
	import 'virtual:uno.css';
	import '../app.css';

	import StrokeWidthSlider from './StrokeWidthSlider.svelte';
	import DrawingCanvas from './DrawingCanvas.svelte';

	let strokeWidth = 3;
	let strokeColor = '#334155';

	let canvasWidth = 500;
	let canvasHeight = canvasWidth / 1.618;
</script>

<svelte:head>
	<title>Drawing Hokkaido</title>
</svelte:head>

<header class="bg-gray-700 py-2 mb-3 text-white shadow">
	<h1 class="text-center text-xl font-bold">「北海道のかたち」を描いてください</h1>
</header>

<main class="flex flex-col gap-16 justify-center items-center">
	<DrawingCanvas {canvasWidth} {canvasHeight} {strokeWidth} {strokeColor} />

	<div class="flex gap-16">
		<StrokeWidthSlider bind:strokeWidth />
		<div class="flex gap-2 justify-center items-center">
			<input type="color" bind:value={strokeColor} />
			{strokeColor}
		</div>
	</div>
</main>
