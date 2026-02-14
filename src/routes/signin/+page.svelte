<script lang="ts">
	import { page } from '$app/stores';
	import { enhance } from '$app/forms';
	import { goto } from '$app/navigation';
	import { invalidateAll } from '$app/navigation';
	import SignIn from '$lib/components/signin/signin.svelte';
	import AuthWrapper from '$lib/components/auth-wrapper/auth-wrapper.svelte';
	import { showToast } from '@awenovations/aura/toast.store';

	$effect(() => {
		let message = $page.url.searchParams.get('message');

		if (message) {
			showToast({
				severity: 'error',
				message: message
			});

			goto($page.url.pathname, { replaceState: true });
		}
	});

	let loading = $state(false);

	const onSubmit = () => {
		loading = true;

		return async ({ result }) => {
			loading = false;

			if (result.status === 302) {
				invalidateAll();
				goto(result.location);
				showToast({
					severity: 'success',
					message: "You're logged in!"
				});
			} else {
				showToast({
					severity: 'error',
					message: result.data.message ?? 'Sorry, something went wrong, please try again!'
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

<AuthWrapper>
	<form method="post" use:enhance={onSubmit} id="signin-form">
		<SignIn {loading} {signInWithGoogleHandler} {signInWithAppleHandler} />
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
