<script lang="ts">
	import '@unocss/reset/tailwind-compat.css';
	import 'virtual:uno.css';
	import '../app.css';

	import StrokeWidthSlider from './StrokeWidthSlider.svelte';
	import DrawingCanvas from './DrawingCanvas.svelte';

	let strokeWidth = 3;
	let strokeColor = '#333333';

	let canvasWidth = 600;
	let canvasHeight = 300;
</script>

<svelte:head>
	<title>Drawing Hokkaido</title>
</svelte:head>

<header class="flex justify-center my-8">
	<h1 class="text-3xl font-bold">北海道を描く</h1>
</header>

<main class="flex flex-col gap-8 justify-center items-center">
	<div class="flex gap-16">
		<StrokeWidthSlider bind:strokeWidth />
		<div class="flex gap-2 justify-center items-center">
			<input type="color" bind:value={strokeColor} />
			{strokeColor}
		</div>
	</div>

	<DrawingCanvas {canvasWidth} {canvasHeight} {strokeWidth} {strokeColor} />
</main>
