<script lang="ts">
	import { enhance } from '$app/forms';
	import { goto } from '$app/navigation';
	import Link from '@awenovations/aura/link.svelte';
	import Button from '@awenovations/aura/button.svelte';
	import Container from '@awenovations/aura/container.svelte';
	import TextField from '@awenovations/aura/text-field.svelte';

	const submit = (event: HTMLEvent) => async ({ result }) => {
    goto(`/pwd-reset/check-your-email?email=${result.data.email}`);
  };
</script>

<Container kind="filled" variant="elevated" clearPadding>
	<div class="content-wrapper">
		<div>
			<h3>Reset Password</h3>
			<span>Enter the email you used to register.</span>
		</div>

		<form method="post" use:enhance={submit}>
			<div class="form-wrapper">
				<TextField name="email" data-cy="email" placeholder="email@example.com">
					{#snippet label()}
						<span>Email</span>
					{/snippet}
				</TextField>
				<Button type="submit" fullWidth variant="tertiary">Send instructions</Button>
			</div>
		</form>
		<Link href="/signin">← Back to sign in</Link>
	</div>
</Container>

<style lang="scss">
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
