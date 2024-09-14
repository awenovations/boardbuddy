<script lang="ts">
	import Signup from '$lib/components/signup/signup.svelte';
  import { submitUserEvent } from '$lib/auth/server/helpers';
	import { SignIn as SignInForm } from '@auth/sveltekit/components';

	export const handleOnSubmit = async () => {
    const form = document.getElementById('signup-form');

		const data = new URLSearchParams();

		for (const pair of new FormData(form)) {
			data.append(pair[0], pair[1]);
		}

		await submitUserEvent(data);
	};

</script>

<Signup />
<SignInForm provider="google" signInPages="signin" class="google-sign-in hidden-sign-up-form" />
<button class="local-signup-form hidden-sign-up-form" on:click={handleOnSubmit} />
