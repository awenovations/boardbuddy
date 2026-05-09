<script lang="ts">
	import Icon from '@awenovations/aura/icon.svelte';
	import Link from '@awenovations/aura/link.svelte';
	import Container from '@awenovations/aura/container.svelte';
</script>

<Container class="dialog" kind="filled" variant="elevated" clearPadding>
	<div class="content-wrapper">
		<Icon name="checkmark" size="large" />

		<h3>Payment successful!</h3>

		<span>You now have lifetime access to Board Buddy.</span>

		<Link href="/app">&rarr; Go to your boards</Link>
	</div>
</Container>

<style lang="scss">
	:global(.dialog) {
		margin: 0 auto;
	}

	.content-wrapper {
		box-sizing: border-box;
		padding: 2.5rem;
		width: 25.643rem;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		gap: 2.5rem;

		& :global(.aura-icon .icon) {
			background: var(--aura-success-40) !important;
		}
	}
</style>
