<script lang="ts">
	import { goto } from '$app/navigation';
	import Icon from '@awenovations/aura/icon.svelte';
	import Link from '@awenovations/aura/link.svelte';
	import Container from '@awenovations/aura/container.svelte';

	const submit =
		(event: HTMLEvent) =>
		async ({ result }) => {
			goto(`/pwd-reset/check-your-email?email=${result.data.email}`);
		};
</script>

<Container kind="filled" variant="elevated" clearPadding>
	<div class="content-wrapper">
		<Icon name="checkmark" size="large" />

		<h3>Success!</h3>

		<span>Your password has successfully been reset. Click below to signin.</span>

		<Link href="/signin">← Back to sign in</Link>
	</div>
</Container>

<style lang="scss">
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
