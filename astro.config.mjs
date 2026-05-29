import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';

export default defineConfig({
  integrations: [tailwind()],
  site: 'https://vismaytiwari.github.io',
  base: '/portfolio',
  output: 'static',
  devToolbar: { enabled: false },
});
