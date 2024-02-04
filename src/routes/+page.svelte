<script lang="ts">
	import '@unocss/reset/tailwind-compat.css';
	import 'virtual:uno.css';
	import '../app.css';
	import type { Stroke, Session } from '$lib/types';
	import { doConfetti } from '$lib/utils';
	import DrawingCanvas from './DrawingCanvas.svelte';
	import SessionList from './SessionList.svelte';
	import Settings from './Settings.svelte';
	import { onMount } from 'svelte';

	// Settings
	let showSettings = false;
	let strokeWidth = 8;
	let strokeColor = '#334155';

	// Canvas - always keep the aspect ratio
	let canvasComponent: DrawingCanvas;
	const canvasMargin = { width: 30, height: 80 };
	const canvasAspectRatio = 2360 / 1640; // iPad Air - 2360 x 1640
	let canvasWidth = 2360 / 2 - canvasMargin.width;
	let canvasHeight = canvasWidth / canvasAspectRatio;
	const handleResize = () => {
		if (window.innerHeight < window.innerWidth) {
			// landscape
			canvasHeight = Math.min(window.innerHeight, 1640 / 2) - canvasMargin.height;
			canvasWidth = canvasHeight * canvasAspectRatio;
		} else {
			// portrait
			canvasWidth = Math.min(window.innerWidth, 2360 / 2) - canvasMargin.width;
			canvasHeight = canvasWidth / canvasAspectRatio;
		}
	};

	// Mode
	let mode: 'init' | 'draw' | 'replay' = 'init';
	let drawingTimer = 30;
	$: {
		mode;
		startTime = Date.now();
	}

	// Drawing
	let showSessionList = false;
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

	function finishDrawing(event: MouseEvent) {
		doConfetti(event.clientX / window.innerWidth, event.clientY / window.innerHeight);
		setTimeout(() => {
			saveSession();
			mode = 'init';
		}, 0);
	}

	let sessionTimestamp = '';
	function showSession(session: Session) {
		mode = 'replay';
		sessionTimestamp = new Date(session.endTime).toISOString();
		canvasComponent.clear();
		canvasComponent.drawSession(session.strokes);
	}

	function replay() {
		// TODO:
		// select N strokes
		// Set opacity, change them accordingly
		// draw all
	}

	onMount(() => {
		window.addEventListener('resize', handleResize);
		handleResize();
		return () => {
			window.removeEventListener('resize', handleResize);
		};
	});
</script>

<svelte:head>
	<title>りんかくをかさねる - ななめせんなめせん</title>
</svelte:head>

<header class="bg-gray-700 py-2 mb-3 text-white shadow flex items-center justify-between">
	<div class="ml-6">
		<button
			class="i-icon-park-solid-clear-format w-5 h-5 hover:opacity-75"
			on:click={canvasComponent.clear}
		/>
	</div>

	<div class="flex items-center gap-3">
		<h1 class="text-center text-xl font-bold">「北海道のかたち」を描いてください</h1>
	</div>

	<div class="mr-6 flex gap-4 items-center">
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

<SessionList bind:showSessionList bind:sessions {showSession} />
<Settings bind:showSettings bind:strokeWidth bind:strokeColor />

<main class="flex flex-col gap-1 justify-center items-center">
	{#if mode === 'init'}
		<div class="absolute z-10">
			<button
				class="bg-gray-700 text-white px-8 py-6 rounded-full shadow-xl hover:opacity-75 text-5xl"
				on:click={() => (mode = 'draw')}>はじめる</button
			>
		</div>
	{/if}

	<div
		class="relative rounded-lg"
		class:bg-gray-400={mode === 'init'}
		class:bg-gray-300={mode === 'replay'}
	>
		<div class={mode === 'draw' ? '' : 'pointer-events-none'}>
			<DrawingCanvas
				bind:this={canvasComponent}
				{canvasWidth}
				{canvasHeight}
				{strokeWidth}
				{strokeColor}
				bind:strokes
			/>
		</div>

		{#if mode === 'draw'}
			<div class="absolute bottom-3 right-3">
				<button
					class="bg-gray-700 text-white px-6 py-2 rounded-full shadow-xl hover:opacity-75 text-xl"
					on:click={finishDrawing}
				>
					終わる 🚀
				</button>
			</div>
		{/if}

		{#if mode === 'replay'}
			<div class="absolute top-3 left-3 text-gray-70 text-xl">{sessionTimestamp}</div>
			<div class="absolute bottom-3 right-3">
				<button
					class="bg-gray-700 text-white px-6 py-2 rounded-full shadow-xl hover:opacity-75 text-xl"
					on:click={() => {
						canvasComponent.clear();
						mode = 'init';
					}}
				>
					もどる
				</button>
			</div>
		{/if}
	</div>
</main>
