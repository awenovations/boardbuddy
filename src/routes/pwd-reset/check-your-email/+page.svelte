<script lang="ts">
	import { page } from '$app/stores';
	import { enhance } from '$app/forms';
	import { goto } from '$app/navigation';
	import Link from '@awenovations/aura/link.svelte';
	import Button from '@awenovations/aura/button.svelte';
	import Container from '@awenovations/aura/container.svelte';
	import TextField from '@awenovations/aura/text-field.svelte';

	const email = $page.url.searchParams.get('email');
	let form: HTMLFormElement;

	$effect(() => {
		if (!email) goto('/pwd-reset/request');
	});
</script>

<Container class="dialog" kind="filled" variant="elevated" clearPadding>
	<div class="content-wrapper">
		<div>
			<h3>Check your email</h3>
		</div>

		<span>
			We sent a password reset link to <Link href={`mailto:${email}`}>{email}</Link>
		</span>

		<span>
			<form
				bind:this={form}
				method="post"
				action={`/pwd-reset/check-your-email?email=${email}`}
				use:enhance
			>
				<input type="hidden" name="email" value={email} />
				If you didn’t receive the email, <Link onclick={() => form.submit()}
					>click here to resend.</Link
				>
			</form>
		</span>

		<Link href="/signin">← Back to sign in</Link>
	</div>
</Container>

<style lang="scss">
	:global(.dialog) {
		margin: 0 auto;
	}

	.content-wrapper {
		box-sizing: border-box;
		padding: 3rem 3.714rem 1.857rem;
		width: 25.643rem;
		height: 22.071rem;
		display: flex;
		flex-direction: column;
		gap: 2rem;
	}

	.form-wrapper {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
	}
</style>
