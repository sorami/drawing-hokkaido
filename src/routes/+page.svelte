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
	import { fade } from 'svelte/transition';
	import { sineIn } from 'svelte/easing';

	function randomRange(min: number, max: number) {
		return Math.random() * (max - min) + min;
	}

	const REPLAY_ADD_INTERVAL = 1000;
	const replayFadeInDuration = () => randomRange(1000, 4000);
	const replayFadeOutDuration = () => randomRange(1000, 2000);

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
	let mode: 'init' | 'draw' | 'log' | 'replay' = 'init';
	$: {
		mode;
		startTime = Date.now();
	}

	// Drawing
	let showSessionList = false;
	let strokes: Stroke[] = [];
	let sessions: Session[] = [];
	let startTime: number = Date.now();

	async function saveSession() {
		const blob = await canvasComponent.toBlob();
		sessions = [
			...sessions,
			{
				strokes: strokes,
				tStart: startTime,
				tEnd: Date.now(),
				blob,
				blobUrl: URL.createObjectURL(blob)
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

	let replayCaption = '';
	function showSession(session: Session) {
		mode = 'log';
		replayCaption = new Date(session.tStart).toISOString();
		canvasComponent.clear();
		canvasComponent.drawStrokes(session.strokes);
	}
	function showAllSessions() {
		mode = 'log';
		replayCaption = `${sessions.length} セッション`;
		canvasComponent.clear();
		for (const session of sessions) {
			canvasComponent.drawStrokes(session.strokes, 0.5);
		}
	}

	type ReplayItem = { key: string; src: string };
	let replayItems: ReplayItem[] = [];
	let fadingOutItemKeys = new Set<string>();
	function replay() {
		mode = 'replay';
		canvasComponent.clear();
		if (sessions.length === 0) return;
		replayItems = [];

		const candidates: ReplayItem[] = sessions.map((session, i) => ({
			key: i.toString(),
			src: session.blobUrl
		}));

		function selectRandom() {
			// filter out items that are already in current replayItems
			let remainingCandidates = candidates.filter(
				(cand) => !replayItems.some((replayItem) => replayItem.key === cand.key)
			);

			// filter out items that are in fading out state
			remainingCandidates = remainingCandidates.filter((cand) => !fadingOutItemKeys.has(cand.key));

			if (remainingCandidates.length === 0) return null;

			// select a random item
			const randomIndex = Math.floor(Math.random() * remainingCandidates.length);
			return remainingCandidates[randomIndex];
		}

		// add a random item
		let intervalId1: number;
		intervalId1 = setInterval(() => {
			const randomItem = selectRandom();
			if (randomItem) replayItems = [...replayItems, randomItem];
			if (mode !== 'replay') clearInterval(intervalId1);
		}, REPLAY_ADD_INTERVAL);
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
	<div class="ml-6 flex gap-6 items-center">
		<button
			class="i-icon-park-solid-clear-format w-5 h-5 hover:opacity-75"
			on:click={canvasComponent.clear}
		/>
		<button
			class="i-material-symbols-home w-5 h-5 hover:opacity-75"
			on:click={() => {
				canvasComponent.clear();
				mode = 'init';
			}}
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

<SessionList bind:showSessionList bind:sessions {showSession} {showAllSessions} />
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
		class:bg-gray-300={mode === 'log'}
	>
		<div class={mode === 'draw' ? '' : 'pointer-events-none'}>
			<div>
				<DrawingCanvas
					bind:this={canvasComponent}
					{canvasWidth}
					{canvasHeight}
					{strokeWidth}
					{strokeColor}
					bind:strokes
				/>
			</div>
		</div>

		{#if mode == 'replay'}
			<div class="absolute top-0 left-0 w-full h-full">
				<div id="image-container" class="relative">
					{#each replayItems as replayItem (replayItem.key)}
						<div
							class="absolute top-0 left-0"
							in:fade={{ duration: replayFadeInDuration(), easing: sineIn }}
							on:introend={() => {
								// immediately remove the item
								replayItems = replayItems.filter((d) => d.key !== replayItem.key);
								// keep track of the items in fading out state
								fadingOutItemKeys.add(replayItem.key);
							}}
							out:fade={{ duration: replayFadeOutDuration(), easing: sineIn }}
							on:outroend={() => {
								// fade out is done, remove the item
								fadingOutItemKeys.delete(replayItem.key);
							}}
						>
							<img alt={replayItem.key} src={replayItem.src} />
						</div>
					{/each}
				</div>
			</div>
		{/if}

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

		{#if mode === 'log'}
			<div class="absolute top-5 left-5 text-gray-700 text-xl">{replayCaption}</div>
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
