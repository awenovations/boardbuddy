<script lang="ts">
	import Icon from '@awenovations/aura/icon.svelte';
	import Link from '@awenovations/aura/link.svelte';
	import Button from '@awenovations/aura/button.svelte';
	import Divider from '@awenovations/aura/divider.svelte';
	import Container from '@awenovations/aura/container.svelte';
	import TextField from '@awenovations/aura/text-field.svelte';

  export let loading : boolean = false;
  export let signInWithGoogleHandler = () => {};
</script>

<Container kind="filled" variant="elevated" clearPadding>
	<div class="content-wrapper">
		<Button
			fullWidth
			kind="outlined"
			variant="tertiary"
			data-cy="google-button"
			type="button"
      on:click={signInWithGoogleHandler}
		>
			<Icon name="google-color" slot="icon-before" />

			Sign in with Google
		</Button>

		<Button type="button" fullWidth kind="outlined" variant="tertiary" data-cy="apple-button">
			<Icon name="apple" slot="icon-before" />

			Sign in with Apple
		</Button>

		<div>
			<Divider data-cy="divider">OR</Divider>
		</div>

		<div class="signin-form">
			<div class="form-group">
				<TextField name="email" data-cy="email" placeholder="email@example.com">
					<span slot="label">Email</span>
				</TextField>
				<TextField name="password" data-cy="password" type="password" placeholder="password" />
				<div class="forgot-password" data-cy="forgot-password">
					Forgot Password? <Link data-cy="forgot-password-link">Reset now</Link>
				</div>
			</div>
      <Button type="submit" loading={loading} fullWidth variant="tertiary" data-cy="sign-in">Sign in</Button>
		</div>
		<div class="sign-up" data-cy="sign-up">
			Don't have an account?
			<Link data-cy="sign-up-link" href="/signup">Sign up</Link>
		</div>
	</div></Container
>

<style lang="scss">
	.signin-form,
	.form-group,
	.content-wrapper {
		display: flex;
		flex-direction: column;
		justify-content: flex-start;
	}

	.form-group {
		gap: 0.643rem;

		.forgot-password {
			width: fit-content;
		}
	}

	.content-wrapper,
	.signin-form {
		gap: 1.5rem;
	}

	.content-wrapper {
		box-sizing: border-box;
		padding: 3rem 3.714rem 1.857rem;
		width: 25.643rem;
		height: 34.214rem;
	}

	.sign-up {
		flex: 1;
		display: flex;
		gap: 5px;
		align-items: self-end;
		justify-content: center;
	}
</style>
