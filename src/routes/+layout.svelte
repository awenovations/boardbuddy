<script lang="ts">
	import 'reset-css/reset.css';
	import '@awenovations/aura/dist/tokens/_variables.css';
	import Toast from '@awenovations/aura/toast.svelte';
	import { showToast } from '@awenovations/aura/toast.store';

	let { data, children } = $props();

	$effect(() => {
		if (data.errorMessage) {
			showToast({
				severity: 'error',
				message: data.errorMessage
			});
		}
	});
</script>

{@render children?.()}
<Toast />

<style lang="scss">
	@import url('https://fonts.googleapis.com/css2?family=Roboto:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap');

	:global(.hidden-sign-in-form),
	:global(.hidden-sign-up-form) {
		display: none;
	}

	:global(html, body) {
		width: 100%;
		background: var(--aura-background);
		font: var(--aura-default-regular);
		color: var(--aura-font-color);
		height: 100%;
	}

	:global(.logo) {
		color: var(--aura-light-secondary-40);
		display: flex;
		flex-direction: column;

		:global(.name) {
			font: var(--aura-display2);
		}
	}
</style>
