<script lang="ts">
	import StrokeWidthSlider from './StrokeWidthSlider.svelte';

	export let showSettings: boolean;
	export let strokeWidth: number;
	export let strokeColor: string;
</script>

{#if showSettings}
	<div class=" z-10 absolute right-3 top-12 bg-gray-700 p-4 rounded text-white">
		<div class="flex flex-col gap-3">
			<StrokeWidthSlider bind:strokeWidth />
			<div class="flex gap-2 items-center">
				<input type="color" bind:value={strokeColor} />
				{strokeColor}
			</div>
		</div>
		<div class=" flex justify-end text-xl">
			<button
				class="i-material-symbols-cancel opacity-75"
				on:click={() => (showSettings = false)}
			/>
		</div>
	</div>
{/if}
