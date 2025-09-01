<script lang="ts">
	import { enhance } from '$app/forms';
	import { goto } from '$app/navigation';
	import Link from '@awenovations/aura/link.svelte';
	import Button from '@awenovations/aura/button.svelte';
	import Container from '@awenovations/aura/container.svelte';
	import TextField from '@awenovations/aura/text-field.svelte';

	let password = $state('');
	let confirmPassword = $state('');
	let pristine = $state(true);
	let valid = $derived(!pristine && password === confirmPassword);

	const submit =
		(event: HTMLEvent) =>
		async ({ result }) => {
			goto('/pwd-reset/success');
		};
</script>

<Container kind="filled" variant="elevated" clearPadding>
	<div class="content-wrapper">
		<h3>Reset Password</h3>

		<form method="post" use:enhance={submit}>
			<div class="form-wrapper">
				<TextField name="newPassword" required type="password" bind:value={password}>
					{#snippet label()}
						<span>New Password</span>
					{/snippet}
				</TextField>
				<TextField
					name="confirmPassword"
					required
					type="password"
					on:change={() => (pristine = false)}
					bind:value={confirmPassword}
					showErrors={!pristine && !valid}
				>
					{#snippet errors()}
						Passwords don't match
					{/snippet}
					{#snippet label()}
						<span>Confirm Password</span>
					{/snippet}
				</TextField>
				<Button type="submit" fullWidth variant="tertiary" disabled={!valid}>Reset</Button>
			</div>
		</form>
		<div class="link-for-signin">
			Don't need to change it? <Link href="/signin">Sign in</Link>
		</div>
	</div>
</Container>

<style lang="scss">
	.content-wrapper {
		box-sizing: border-box;
		padding: 3rem 3.714rem 1.857rem;
		width: 25.643rem;
		display: flex;
		flex-direction: column;
		gap: 2rem;
	}

	.form-wrapper {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
	}

	.link-for-signin {
		display: flex;
		gap: 0.25rem;
		justify-content: center;
	}
</style>
