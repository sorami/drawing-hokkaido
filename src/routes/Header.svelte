<script lang="ts">
	import type { ModeOptions } from '$lib/types';
	import DrawingCanvas from './DrawingCanvas.svelte';

	export let mode: ModeOptions;
	export let showSessionList: boolean;
	export let showSettings: boolean;
	export let replay: () => void;
	export let canvasComponent: DrawingCanvas;
</script>

<header class="bg-gray-700 py-2 mb-3 text-white shadow flex items-center justify-between">
	<div class="ml-6 flex gap-6 items-center">
		<button
			class="i-material-symbols-home w-5 h-5 hover:opacity-75"
			on:click={() => {
				canvasComponent.clear();
				mode = 'init';
			}}
		/>
		<button
			class="i-icon-park-solid-clear-format w-5 h-5 hover:opacity-75"
			on:click={canvasComponent.clear}
		/>
	</div>

	<div class="flex items-center gap-3">
		<h1 class="text-center text-xl font-bold">「北海道のかたち」を描いてください</h1>
	</div>

	<div class="mr-6 flex gap-6 items-center">
		<button class="i-material-symbols-replay w-6 h-6 hover:opacity-75" on:click={() => replay()} />
		<button
			class="i-material-symbols-list-alt w-6 h-6 hover:opacity-75"
			on:click={() => (showSessionList = !showSessionList)}
		/>
		<button
			class="i-material-symbols-settings w-5 h-5 hover:opacity-75"
			on:click={() => (showSettings = !showSettings)}
		/>
	</div>
</header>
