import { defineConfig, presetAttributify, presetUno } from 'unocss';
import transformerDirective from '@unocss/transformer-directives';

export default defineConfig({
  presets: [
    presetUno({ dark: 'class' }),
    presetAttributify(),
  ],
  transformers: [transformerDirective()]
})