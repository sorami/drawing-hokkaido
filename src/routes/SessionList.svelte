<script lang="ts">
	import type { Session } from '$lib/types';

	export let showSessionList: boolean;
	export let sessions: Session[];
</script>

{#if showSessionList}
	<div class=" z-10 absolute right-3 top-12 bg-gray-700 p-4 rounded text-white">
		<div class="flex items-center gap-3 justify-between">
			<div class="text-sm">{sessions.length} セッション</div>
			<button
				class="i-material-symbols-cancel w-4 h-4 opacity-75"
				on:click={() => (showSessionList = false)}
			/>
		</div>

		<div class="mt-3">
			<ul class="text-sm">
				{#each sessions.sort((a, b) => b.endTime - a.endTime) as session}
					<li>
						{new Date(session.endTime).toISOString()}
					</li>
				{/each}
			</ul>
		</div>
	</div>
{/if}

<style>
	ul {
		list-style-type: disc;
		padding-left: 1em;
	}
</style>
