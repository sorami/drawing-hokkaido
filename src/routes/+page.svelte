<script lang="ts">
	import '@unocss/reset/tailwind-compat.css';
	import 'virtual:uno.css';
	import '../app.css';
	import type { Stroke, Session, ModeOptions } from '$lib/types';
	import { doConfetti } from '$lib/utils';
	import Header from './Header.svelte';
	import DrawingCanvas from './DrawingCanvas.svelte';
	import SessionList from './SessionList.svelte';
	import Settings from './Settings.svelte';
	import { onMount } from 'svelte';
	import { fade } from 'svelte/transition';
	import { sineIn } from 'svelte/easing';

	import { initializeApp } from 'firebase/app';
	import { getFirestore } from 'firebase/firestore';
	import { firebaseConfig } from '$lib/firebase';
	import { collection, addDoc, Bytes, getDocs } from 'firebase/firestore';

	// url params
	let showHeader = false;

	// firebase setup
	const app = initializeApp(firebaseConfig);
	const db = getFirestore(app);

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
	let mode: ModeOptions = 'init';

	// Drawing
	let showSessionList = false;
	let strokes: Stroke[] = [];
	let sessions: Session[] = [];
	let startedAt: Date = new Date(Date.now());

	$: if (mode === 'draw') {
		startedAt = new Date(Date.now());
	}

	async function saveSession() {
		const blob = await canvasComponent.toBlob();
		const currSession: Session = {
			strokes: strokes,
			time: { startedAt, endedAt: new Date(Date.now()) },
			canvasSize: { width: canvasWidth, height: canvasHeight },
			blob,
			blobUrl: URL.createObjectURL(blob)
		};
		sessions = [...sessions, currSession];
		strokes = [];
		canvasComponent.clear();

		const docRefId = await writeData(currSession);
	}

	async function writeData(session: Session) {
		try {
			const docRef = await addDoc(collection(db, 'sessions'), {
				strokes: session.strokes,
				time: session.time,
				canvasSize: session.canvasSize,
				img: Bytes.fromUint8Array(new Uint8Array(await session.blob!.arrayBuffer()))
			});
			return docRef.id;
		} catch (e) {
			console.error('Error adding document: ', e);
		}
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
		replayCaption = session.time.startedAt.toLocaleString('ja-JP', { timeZone: 'Asia/Tokyo' });
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
		const intervalId = setInterval(() => {
			const randomItem = selectRandom();
			if (randomItem) replayItems = [...replayItems, randomItem];
			if (mode !== 'replay') clearInterval(intervalId);
		}, REPLAY_ADD_INTERVAL);
	}

	async function loadData() {
		const loadedSession: Session[] = [];
		const querySnapshot = await getDocs(collection(db, 'sessions'));
		querySnapshot.forEach((doc) => {
			const data = doc.data();
			const blob = new Blob([data.img.toUint8Array().buffer], { type: 'image/png' });
			const blobUrl = URL.createObjectURL(blob);
			loadedSession.push({
				strokes: data.strokes,
				time: { startedAt: data.time.startedAt.toDate(), endedAt: data.time.endedAt.toDate() },
				canvasSize: data.canvasSize,
				blob,
				blobUrl
			});
		});
		sessions = loadedSession;
	}

	onMount(() => {
		handleResize();

		const urlParams = new URLSearchParams(window.location.search);
		if (urlParams.has('header')) {
			showHeader = true;
		}

		loadData();

		window.addEventListener('resize', handleResize);
		return () => {
			window.removeEventListener('resize', handleResize);
		};
	});
</script>

<svelte:head>
	<title>りんかくをかさねる - ななめせんなめせん</title>
</svelte:head>

{#if showHeader}
	<Header bind:mode bind:showSessionList bind:showSettings {replay} {canvasComponent} />
{/if}

<SessionList bind:showSessionList bind:sessions {showSession} {showAllSessions} />
<Settings bind:showSettings bind:strokeWidth bind:strokeColor />

<main class="flex flex-col gap-1 justify-center items-center">
	{#if mode === 'init'}
		<div class="absolute z-10">
			<button
				class="bg-gray-700 text-white px-8 py-6 rounded-full shadow-xl hover:opacity-75 text-5xl"
				on:click={() => (mode = 'draw')}
			>
				<div class="flex gap-3 items-center">
					<div class="i-fluent-hand-draw-20-filled" />
					<div>はじめる</div>
				</div></button
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
					<div class="flex gap-2 items-center">
						<div class="i-material-symbols-check-circle" />
						<div>おわる</div>
					</div>
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
