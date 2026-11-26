<script lang="ts">
	import { enhance } from '$app/forms';
	import Link from '@awenovations/aura/link.svelte';
	import Button from '@awenovations/aura/button.svelte';
	import Container from '@awenovations/aura/container.svelte';
	import { showToast } from '@awenovations/aura/toast.store';

	let { data } = $props();

	let loading = $state(false);

	const onResend = () => {
		loading = true;

		return async ({ result }: { result: any }) => {
			loading = false;

			if (result.type === 'failure') {
				showToast({
					severity: 'error',
					message: result.data?.message ?? 'Sorry, something went wrong, please try again!'
				});
			} else if (result.type === 'success') {
				showToast({ severity: 'success', message: 'We sent you a new link.' });
			}
		};
	};
</script>

<div class="wrapper">
	<Container class="dialog" kind="filled" variant="elevated" clearPadding>
		<div class="content-wrapper">
			<h3>Check your email</h3>

			<span>
				We sent a link to <Link href={`mailto:${data.email}`}>{data.email}</Link>. Click it to
				confirm your email and start using Board Buddy.
			</span>

			<span class="hint">The link expires in 24 hours.</span>

			<form method="post" use:enhance={onResend}>
				<Button type="submit" {loading} variant="tertiary" fullWidth
					>Resend email</Button
				>
			</form>

			<form method="post" action="/signout">
				<Button type="submit" kind="outlined" variant="tertiary" fullWidth>Sign out</Button>
			</form>
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

	.hint {
		color: var(--aura-tertiary-50);
	}
</style>
