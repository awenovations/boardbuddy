<script lang="ts">
	import { enhance } from '$app/forms';
	import { goto } from '$app/navigation';
	import SignIn from '$lib/components/signin/signin.svelte';
	import { showToast } from '@awenovations/aura/toast.store';

	let loading = $state(false);

	const onSubmit = () => {
		loading = true;

		return async ({ result }) => {
			loading = false;

			if (result.status === 302) {
				goto(result.location);
				showToast({
					severity: 'success',
					message: "You're logged in!"
				});
			} else {
				showToast({
					severity: 'error',
					message: 'Sorry, something went wrong, please try again!'
				});
			}
		};
	};

	const signInWithGoogleHandler = () => {
		goto('/signin/providers/google');
	};

	const signInWithAppleHandler = () => {
		goto('/signin/providers/apple');
	};
</script>

<form method="post" use:enhance={onSubmit} id="signin-form">
	<SignIn {loading} {signInWithGoogleHandler} {signInWithAppleHandler} />
</form>

<style lang="scss">
	form {
		display: flex;
		flex-direction: column;
		justify-content: flex-start;
	}
</style>
