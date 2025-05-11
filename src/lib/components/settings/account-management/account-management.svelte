<script lang="ts">
	import debounce from 'lodash.debounce';
	import Button from '@awenovations/aura/button.svelte';
	import Tooltip from '@awenovations/aura/tooltip.svelte';
	import { showToast } from '@awenovations/aura/toast.store';
	import TextField from '@awenovations/aura/text-field.svelte';

	let { user } = $props();

	let currentPassword = $state('');
	let newPassword = $state('');
	let confirmPassword = $state('');
	let showCurrentPasswordError = $state(false);
	let showConfirmPasswordError = $state(false);

	$effect(() => {
		showConfirmPasswordError = !!confirmPassword.trim() && confirmPassword !== newPassword;
	});

	let changePasswordFormLoading = $state(false);

	let userForm = $state(false);

	const submitForm = async (event: FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		console.log('test');

		changePasswordFormLoading = true;

		if (!showConfirmPasswordError) {
			const response = await fetch(`/api/user/${user._id}/change-password`, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ currentPassword, newPassword, confirmPassword })
			});

			if (response.ok) {
				showToast({
					severity: 'success',
					message: 'Password updated!'
				});
				currentPassword = '';
				newPassword = '';
				confirmPassword = '';
			} else {
				const response = await result.json();
				showToast({
					severity: 'error',
					message: response.message
				});
			}
		}

		changePasswordFormLoading = false;
	};

	const checkPassword = debounce(async () => {
		if (!!currentPassword.trim()) {
			const response = await fetch(`/api/user/${user._id}/authenticate`, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ currentPassword })
			});

			showCurrentPasswordError = !response.ok;
		} else {
			showCurrentPasswordError = false;
		}
	}, 500);
</script>

<form onsubmit={submitForm}>
	<h3>Account Information</h3>
	{#if user.authProvider === 'board-buddy'}
		<h4>Change Password</h4>
		<TextField
			name="currentPassword"
			bind:value={currentPassword}
			onkeyup={checkPassword}
			type="password"
			showErrors={showCurrentPasswordError}
		>
			{#snippet errors()}
				Incorrect password
			{/snippet}
			{#snippet label()}
				Current Password
			{/snippet}
		</TextField>
		<TextField name="newPassword" bind:value={newPassword} type="password">
			{#snippet label()}
				New Password
			{/snippet}
		</TextField>
		<TextField
			type="password"
			name="confirmPassword"
			bind:value={confirmPassword}
			showErrors={showConfirmPasswordError}
		>
			{#snippet errors()}
				Passwords don't match
			{/snippet}
			{#snippet label()}
				Confirm Password
			{/snippet}
		</TextField>
		<Button
			type="submit"
			bind:loading={changePasswordFormLoading}
			kind="outlined"
			disabled={showConfirmPasswordError}>Change Password</Button
		>
	{/if}
</form>

<style lang="scss">
	form {
		box-sizing: border-box;
		display: flex;
		flex-direction: column;
		gap: 1rem;
	}
</style>
