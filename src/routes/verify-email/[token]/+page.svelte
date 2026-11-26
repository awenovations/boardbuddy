<script lang="ts">
	import Link from '@awenovations/aura/link.svelte';
	import Container from '@awenovations/aura/container.svelte';

	let { data } = $props();
</script>

<div class="wrapper">
	<Container class="dialog" kind="filled" variant="elevated" clearPadding>
		<div class="content-wrapper">
			<h3>This link has expired</h3>

			<span>
				Confirmation links work once, for 24 hours, and only the most recent one you were sent
				is valid.
			</span>

			{#if data.signedIn}
				<Link href="/verify-email">Send me a new link</Link>
			{:else}
				<Link href="/signin">Sign in to get a new link</Link>
			{/if}
		</div>
	</Container>
</div>

<style lang="scss">
	.wrapper {
		display: flex;
		justify-content: center;
		flex-direction: column;
		height: 100%;
	}

	:global(.dialog) {
		margin: 0 auto;
	}

	.content-wrapper {
		box-sizing: border-box;
		padding: 3rem 3.714rem 1.857rem;
		width: 25.643rem;
		display: flex;
		flex-direction: column;
		gap: 1.5rem;
	}
</style>
