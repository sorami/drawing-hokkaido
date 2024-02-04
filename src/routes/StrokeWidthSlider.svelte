<script lang="ts">
	export let strokeWidth: number;
	const MIN_WIDTH = 1;
	const MAX_WIDTH = 20;
</script>

<div class="flex gap-x-3 items-center text-xl">
	<div class="i-heroicons-paint-brush-16-solid" />
	<input
		type="range"
		name="speed"
		id="speed"
		bind:value={strokeWidth}
		min={MIN_WIDTH}
		max={MAX_WIDTH}
		step="1"
		class="w-52"
	/>
	<div class="w-3">
		{strokeWidth}
	</div>
</div>
