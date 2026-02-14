<script lang="ts">
	import Link from '@awenovations/aura/link.svelte';

	let { children } = $props();
</script>

<div class="auth-wrapper">
	<header>
		<div class="logo">
			<span class="name">Board Buddy</span>
			Simplify Your Workflow
		</div>
	</header>

	{@render children?.()}
</div>

<footer class="auth-footer">
	&copy; {new Date().getFullYear()} Benjamin Knox | Feedback:&nbsp;<Link
		href="mailto:ben@knoxes.email">ben@knoxes.email</Link
	>&nbsp;| My Website:&nbsp;<Link target="blank" href="https://knox.pro">knox.pro</Link>
</footer>

<style lang="scss">
	.auth-wrapper {
		display: flex;
		flex-direction: column;
		padding: 1.875rem 0 4.018rem;
		box-sizing: border-box;
		margin: 0 auto;
		min-width: 71.429rem;
		width: fit-content;
		max-height: 100%;
		gap: 0.714rem;
		overflow: hidden;
		background: var(--aura-background);
		font: var(--aura-default-regular);
		color: var(--aura-font-color);
		height: 100%;
	}

	:global(.logo) {
		color: var(--aura-light-secondary-40);
		display: flex;
		flex-direction: column;
		align-items: center;

		:global(.name) {
			font: var(--aura-display2);
		}
	}

	:global(.auth-footer) {
		display: flex;
		justify-content: center;
		align-items: center;
		position: absolute;
		bottom: 0;
		left: 0;
		width: 100%;
		background: var(--aura-background);
		height: 2.143rem;
		z-index: 1000;
		font-size: 8pt;
		border-top: 1px solid var(--aura-container-border-color);
		box-sizing: border-box;

		& :global(a.aura-link:active) {
			font-size: 8pt;
		}
	}
</style>
