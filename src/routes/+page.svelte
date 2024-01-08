<script lang="ts">
	import '@unocss/reset/tailwind-compat.css';
	import 'virtual:uno.css';
	import '../app.css';

	import StrokeWidthSlider from './StrokeWidthSlider.svelte';

	let strokeWidth = 5;
</script>

<svelte:head>
	<title>Drawing Hokkaido</title>
</svelte:head>

<header class="flex justify-center my-8">
	<h1 class="text-3xl font-bold">北海道を描く</h1>
</header>

<main class="flex justify-center">
	<div>
		<StrokeWidthSlider bind:strokeWidth />
	</div>
</main>
