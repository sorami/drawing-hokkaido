<script lang="ts">
	import '@unocss/reset/tailwind-compat.css';
	import 'virtual:uno.css';
	import '../app.css';

	import DrawingCanvas from './DrawingCanvas.svelte';
	import Settings from './Settings.svelte';

	let strokeWidth = 3;
	let strokeColor = '#334155';

	let canvasWidth = 500;
	let canvasHeight = canvasWidth / 1.618;

	let showSettings = false;
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

	<Settings bind:showSettings bind:strokeWidth bind:strokeColor />
</main>
