import { defineConfig } from 'unocss';
import presetUno from '@unocss/preset-uno';
import { presetWebFonts } from 'unocss';
import transformerDirectives from '@unocss/transformer-directives';

export default defineConfig({
	presets: [
		presetUno(),
		presetWebFonts({
			fonts: { sans: 'Zen Maru Gothic' }
		})
	],
	transformers: [transformerDirectives()]
});
