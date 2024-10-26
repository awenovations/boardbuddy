<script lang="ts">
  import { enhance } from "$app/forms";
	import { goto } from '$app/navigation';
  import SignUp from "$lib/components/signup/signup.svelte";
	import { showToast } from '@awenovations/aura/toast.store';

	let loading = false;

	const onSubmit = () => {
		loading = true;

		return async ({ result }) => {
			loading = false;

			if (result.status === 302) {
				goto(result.location);
				showToast({
					severity: 'success',
					message: "Thanks for making an account!"
				});
			} else {
				showToast({
					severity: 'error',
					message: 'Sorry, something went wrong, please try again!'
				});
			}
		};
	};

  const signUpWithGoogleHandler = () => {
    goto("/signin/providers/google");
  };

</script>

<form method="post" use:enhance={onSubmit} id="signup-form">
  <SignUp {loading} {signUpWithGoogleHandler} />
</form>

<style lang="scss">
	form {
		display: flex;
		flex-direction: column;
		justify-content: flex-start;
  }

</style>
