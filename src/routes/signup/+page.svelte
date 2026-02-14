<script lang="ts">
	import { enhance } from '$app/forms';
	import { goto } from '$app/navigation';
	import SignUp from '$lib/components/signup/signup.svelte';
	import AuthWrapper from '$lib/components/auth-wrapper/auth-wrapper.svelte';
	import { showToast } from '@awenovations/aura/toast.store';

	let loading = $state(false);

	const onSubmit = () => {
		loading = true;

		return async ({ result }) => {
			loading = false;
			if (result.type === 'failure') {
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

<AuthWrapper>
	<form method="post" use:enhance={onSubmit} id="signup-form">
		<SignUp {loading} {signUpWithGoogleHandler} {signUpWithAppleHandler} />
	</form>
</AuthWrapper>

<style lang="scss">
	form {
		display: flex;
		flex-direction: column;
		justify-content: flex-start;
		align-items: center;
	}
</style>
