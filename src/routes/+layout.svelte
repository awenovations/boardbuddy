<script lang="ts">
	import 'reset-css/reset.css';
	import { onMount } from 'svelte';
	import classNames from 'classnames';
	import Toast from '@awenovations/aura/toast.svelte';
	import '@awenovations/aura/dist/tokens/_variables.css';
	import { showToast } from '@awenovations/aura/toast.store';

	export let data;

	onMount(() => {
		if (data.errorMessage) {
			showToast({
				severity: 'error',
				message: data.errorMessage
			});
		}
	});
</script>

<div class={classNames('wrapper', { center: !data.session })}>
	<div class="logo">
		<span class="name">Board Buddy</span>
		Simplify Your Workflow
	</div>
	<slot />
</div>
<Toast />

<style lang="scss">
	@import url('https://fonts.googleapis.com/css2?family=Roboto:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap');

	:global(.hidden-sign-in-form),
	:global(.hidden-sign-up-form) {
		display: none;
	}

	:global(html, body) {
		width: 100%;
	}

	:global(html, body),
	.wrapper {
		background: var(--aura-background);
		font: var(--aura-default-regular);
		color: var(--aura-font-color);
		height: 100%;
	}

	.wrapper {
		display: flex;
		flex-direction: column;
		padding: 1.875rem 0;
		box-sizing: border-box;
		margin: 0 auto;
		width: fit-content;
		max-height: 100%;
		gap: 3.813rem;
		overflow: hidden;

		&.center {
			gap: 0.714rem;
		}
	}

	.logo {
		color: var(--aura-light-secondary-40);
		display: flex;
		flex-direction: column;

		.name {
			font: var(--aura-display2);
		}

		.center & {
			align-items: center;
		}
	}
</style>
