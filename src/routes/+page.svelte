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

	let showSettings = true;
</script>

<svelte:head>
	<title>りんかくをかさねる - ななめせんなめせん</title>
</svelte:head>

<header class="bg-gray-700 py-2 mb-3 text-white shadow flex items-center justify-between">
	<div class="w-6 h-6 ml-6 opacity-0" />
	<h1 class="text-center text-xl font-bold">「北海道のかたち」を描いてください</h1>
	<button
		class="i-material-symbols-settings w-6 h-6 mr-6 hover:opacity-75"
		on:click={() => (showSettings = true)}
	/>
</header>

<main class="flex flex-col gap-16 justify-center items-center">
	<DrawingCanvas {canvasWidth} {canvasHeight} {strokeWidth} {strokeColor} />

	{#if showSettings}
		<div class=" z-10 absolute right-3 top-12 bg-gray-900/75 p-4 rounded text-white">
			<div class="flex gap-16">
				<StrokeWidthSlider bind:strokeWidth />
				<div class="flex gap-2 justify-center items-center">
					<input type="color" bind:value={strokeColor} />
					{strokeColor}
				</div>
			</div>
			<div class="mt-4 flex justify-end text-xl">
				<button
					class="i-material-symbols-cancel opacity-75"
					on:click={() => (showSettings = false)}
				/>
			</div>
		</div>
	{/if}
</main>
