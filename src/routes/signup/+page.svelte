<script lang="ts">
	import { enhance } from '$app/forms';
	import { goto } from '$app/navigation';
	import SignUp from '$lib/components/signup/signup.svelte';
	import { showToast } from '@awenovations/aura/toast.store';

	let loading = $state(false);

	const onSubmit = () => {
		loading = true;

		return async ({ result }) => {
			loading = false;

			if (result.type === 'failure' && result.status === 400) {
				showToast({
					severity: 'error',
					message: result.data.message ?? 'Sorry, something went wrong, please try again!'
				});
			} else {
				goto(result.location);
				showToast({
					severity: 'success',
					message: 'Thanks for making an account!'
				});
			}
		};
	};

	const signUpWithGoogleHandler = () => {
		goto('/signin/providers/google');
	};

	const signUpWithAppleHandler = () => {
		goto('/signin/providers/apple');
	};
</script>

<form method="post" use:enhance={onSubmit} id="signup-form">
	<SignUp {loading} {signUpWithGoogleHandler} {signUpWithAppleHandler} />
</form>

<style lang="scss">
	form {
		display: flex;
		flex-direction: column;
		justify-content: flex-start;
	}
</style>
