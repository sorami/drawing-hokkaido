<script lang="ts">
	import '@unocss/reset/tailwind-compat.css';
	import 'virtual:uno.css';
	import '../../app.css';

	import { initializeApp } from 'firebase/app';
	import { getFirestore } from 'firebase/firestore';
	import { firebaseConfig } from '$lib/firebase';
	import { collection, getDocs } from 'firebase/firestore';
	import type { Session } from '$lib/types';

	const app = initializeApp(firebaseConfig);
	const db = getFirestore(app);

	let sessions: Session[] = [];
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
	loadData();

	let dateHourSessions: { [s: string]: { [s: string]: Session[] } } = {};
	$: {
		// session per day per hour
		dateHourSessions = {};
		let sortedSesssion = sessions.sort(
			(a, b) => b.time.startedAt.getTime() - a.time.startedAt.getTime()
		);
		for (const session of sortedSesssion) {
			const startedAt = session.time.startedAt;
			const date = startedAt.toISOString().slice(0, 10);
			if (!dateHourSessions[date]) {
				dateHourSessions[date] = {};
			}

			const hour = startedAt.getHours();
			if (!dateHourSessions[date][hour]) {
				dateHourSessions[date][hour] = [];
			}
			dateHourSessions[date][hour].push(session);
		}
	}

	function downloadSession(session: Session) {
		const a = document.createElement('a');
		a.href = session.blobUrl;
		a.download = `${session.time.startedAt}.png`;
		a.click();
	}

	async function downloadAllSessions() {
		for (const session of sessions) {
			downloadSession(session);
			// wait for a while to avoid browser crash
			await new Promise((resolve) => setTimeout(resolve, 100));
		}
	}
</script>

<main class="flex flex-col gap-3 max-w-xl justify-center my-6 mx-auto">
	<div>
		<h1 class="text-xl font-bold">Sessions</h1>
	</div>

	<div class="text-sm">
		{sessions.length} sessions
	</div>
	<div>
		<button
			class="bg-gray-700 rounded px-2 py-1 text-white"
			on:click={async () => downloadAllSessions()}>Download all</button
		>
	</div>

	{#each Object.entries(dateHourSessions) as [date, hourSessions]}
		<div>
			<h2 class="text-lg font-bold mt-3 underline">{date}</h2>
			{#each Object.entries(hourSessions) as [hour, sessions]}
				<div>
					<h3 class="font-bold my-2">{hour}時台（{sessions.length}）</h3>
					<ol>
						{#each sessions as session}
							<!-- svelte-ignore a11y-no-static-element-interactions -->
							<li>
								<!-- svelte-ignore a11y-click-events-have-key-events -->
								<!-- svelte-ignore a11y-missing-attribute -->
								<a on:click={() => downloadSession(session)}>
									{session.time.startedAt.toLocaleString('ja-JP', { timeZone: 'Asia/Tokyo' })}
								</a>
							</li>
						{/each}
					</ol>
				</div>
			{/each}
		</div>
	{/each}
</main>

<style>
	ol {
		list-style-type: decimal;
		padding-left: 1em;
	}
</style>
