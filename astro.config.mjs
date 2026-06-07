import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';

export default defineConfig({
  integrations: [tailwind()],
  site: 'https://sakshichitnis27.github.io',
  base: '/sakshi-portfolio',
  output: 'static',
  devToolbar: { enabled: false },
});
