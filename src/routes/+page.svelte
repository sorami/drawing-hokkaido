<script lang="ts">
	import '@unocss/reset/tailwind-compat.css';
	import 'virtual:uno.css';
	import '../app.css';
	import type { Stroke, Session } from '$lib';
	import DrawingCanvas from './DrawingCanvas.svelte';
	import Settings from './Settings.svelte';

	// Settings
	let showSettings = false;
	let strokeWidth = 3;
	let strokeColor = '#334155';

	// Canvas
	let canvasComponent: DrawingCanvas;
	let canvasWidth = 500;
	let canvasHeight = canvasWidth / 1.618;

	// Drawing
	let strokes: Stroke[] = [];
	let sessions: Session[] = [];
	let startTime: number = Date.now();

	function saveSession() {
		sessions = [
			...sessions,
			{
				strokes: strokes,
				startTime,
				endTime: Date.now()
			}
		];
		strokes = [];
		canvasComponent.clear();
	}

	function replay() {
		// TODO:
		// select N strokes
		// Set opacity, change them accordingly
		// draw all
	}
</script>

<svelte:head>
	<title>りんかくをかさねる - ななめせんなめせん</title>
</svelte:head>

<header class="bg-gray-700 py-2 mb-3 text-white shadow flex items-center justify-between">
	<div class="w-6 h-6 ml-6 opacity-0" />
	<h1 class="text-center text-xl font-bold">「北海道のかたち」を描いてください</h1>
	<div class="mr-6 flex gap-4">
		<button
			class="i-icon-park-solid-clear-format w-5 h-5 hover:opacity-75"
			on:click={canvasComponent.clear}
		/>
		<button
			class="i-material-symbols-settings w-5 h-5 hover:opacity-75"
			on:click={() => (showSettings = !showSettings)}
		/>
	</div>
</header>

<Settings bind:showSettings bind:strokeWidth bind:strokeColor />

<main class="flex flex-col gap-1 justify-center items-center">
	<DrawingCanvas
		bind:this={canvasComponent}
		{canvasWidth}
		{canvasHeight}
		{strokeWidth}
		{strokeColor}
		bind:strokes
	/>

	<button
		class="bg-gray-700 text-white py-2 px-4 rounded shadow hover:opacity-75"
		on:click={() => saveSession()}
	>
		save
	</button>
	<div>
		{sessions.length} sessions
	</div>
	<div class="flex gap-3">
		{#each sessions as session, i}
			<button class="bg-gray-700 text-white py-1 px-4 rounded-full shadow hover:opacity-75">
				{i}
			</button>
		{/each}
	</div>
</main>
