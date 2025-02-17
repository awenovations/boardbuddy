import { resolve } from 'path';
import { defineConfig } from 'cypress';
import { svelte } from '@sveltejs/vite-plugin-svelte';
import { replaceCodePlugin } from '@awenovations/vite-plugin-replace';

export default defineConfig({
	viewportWidth: 500,
	viewportHeight: 800,
  retries: 2,
	component: {
		setupNodeEvents(_, config) {
			return Object.assign({}, config);
		},
		devServer: {
			framework: 'svelte',
			bundler: 'vite',
			viteConfig: () => ({
				plugins: [
					replaceCodePlugin({
						replacements: [
							{
								from: /\/icons/g,
								to: '/__cypress/src/node_modules/@awenovations/aura/dist/icons'
							}
						]
					}),
					svelte()
				],
				resolve: {
					alias: {
						['$lib']: resolve('src/lib'),
						['$app']: resolve('cypress/svelte-shims')
					}
				}
			})
		},
		specPattern: 'src/**/*.{cy,unit}.{js,ts}'
	},

	e2e: {
		setupNodeEvents(on, config) {
			// implement node event listeners here
		}
	}
});
