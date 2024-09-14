<script lang="ts">
	import Signin from '$lib/components/signin/signin.svelte';
	import { signIn as clientSignIn } from '@auth/sveltekit/client';
	import { SignIn as SignInForm } from '@auth/sveltekit/components';

	const handleSigninSubmit = () => {
    const form = document.getElementById('signin-form');

		const formData = [...new FormData(form).entries()].reduce(
			(accumulator, value) => ({
				...accumulator,
				[value[0]]: value[1]
			}),
			{}
		);

		clientSignIn('credentials', formData);
	};

</script>

<Signin />
<SignInForm provider="google" signInPages="signin" class="google-sign-in hidden-sign-in-form" />
<button class="local-signin-form hidden-sign-in-form" on:click={handleSigninSubmit} />
