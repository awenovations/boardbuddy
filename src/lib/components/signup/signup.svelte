<script lang="ts">
	import Icon from '@awenovations/aura/icon.svelte';
	import Link from '@awenovations/aura/link.svelte';
	import Button from '@awenovations/aura/button.svelte';
	import Divider from '@awenovations/aura/divider.svelte';
	import Container from '@awenovations/aura/container.svelte';
	import TextField from '@awenovations/aura/text-field.svelte';
	import { env } from '$env/dynamic/public';

	interface Props {
		loading?: boolean;
		signUpWithGoogleHandler?: any;
		signUpWithAppleHandler?: any;
	}

	let {
		loading = false,
		signUpWithGoogleHandler = () => {},
		signUpWithAppleHandler = () => {}
	}: Props = $props();

	const TURNSTILE_SCRIPT = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit';

	let turnstileEl: HTMLDivElement;

	// Rendered explicitly so the widget also appears after client-side navigation.
	$effect(() => {
		const w = window as any;
		let widgetId: string | undefined;
		let cancelled = false;

		const render = () => {
			if (cancelled || !turnstileEl) return;
			widgetId = w.turnstile.render(turnstileEl, {
				sitekey: env.PUBLIC_TURNSTILE_SITE_KEY,
				theme: 'auto'
			});
		};

		if (w.turnstile) {
			render();
		} else {
			let script = document.querySelector<HTMLScriptElement>('script[data-turnstile]');
			if (!script) {
				script = document.createElement('script');
				script.src = TURNSTILE_SCRIPT;
				script.async = true;
				script.dataset.turnstile = '';
				document.head.appendChild(script);
			}
			script.addEventListener('load', render, { once: true });
		}

		return () => {
			cancelled = true;
			if (widgetId !== undefined) w.turnstile?.remove(widgetId);
		};
	});
</script>

<Container kind="filled" variant="elevated" clearPadding>
	<div class="content-wrapper">
		<Button
			fullWidth
			kind="outlined"
			variant="tertiary"
			data-cy="google-button"
			type="button"
			onclick={signUpWithGoogleHandler}
		>
			<!-- @migration-task: migrate this slot by hand, `icon-before` is an invalid identifier -->
			<Icon name="google-color" slot="icon-before" />

			Continue with Google
		</Button>

		<Button
			fullWidth
			kind="outlined"
			variant="tertiary"
			type="button"
			data-cy="apple-button"
			onclick={signUpWithAppleHandler}
		>
			<!-- @migration-task: migrate this slot by hand, `icon-before` is an invalid identifier -->
			<Icon name="apple" slot="icon-before" />

			Continue with Apple
		</Button>

		<div>
			<Divider data-cy="divider">OR</Divider>
		</div>

		<div class="signup-form">
			<div class="form-group">
				<TextField name="name" data-cy="name" placeholder="Your name">
					{#snippet label()}
						<span>Name</span>
					{/snippet}
				</TextField>
				<TextField
					type="email"
					required
					name="email"
					data-cy="email"
					placeholder="email@example.com"
				>
					{#snippet label()}
						<span>Email</span>
					{/snippet}
				</TextField>
				<TextField
					name="password"
					required
					data-cy="password"
					type="password"
					placeholder="password"
				>
					{#snippet label()}
						<span>Password</span>
					{/snippet}
				</TextField>
			</div>
			<div class="turnstile" bind:this={turnstileEl} data-cy="turnstile"></div>
			<Button type="submit" {loading} fullWidth variant="tertiary" data-cy="sign-up">Sign up</Button
			>
		</div>
		<div class="sign-in" data-cy="sign-in">
			Already have an account?
			<Link data-cy="sign-in-link" href="/signin">Sign in</Link>
		</div>
	</div></Container
>

<style lang="scss">
	.signup-form,
	.form-group,
	.content-wrapper {
		display: flex;
		flex-direction: column;
		justify-content: flex-start;
	}

	.form-group {
		gap: 1.214rem;

		.forgot-password {
			width: fit-content;
		}
	}

	.signup-form,
	.content-wrapper {
		gap: 1.786rem;
	}

	.content-wrapper {
		box-sizing: border-box;
		padding: 3rem 3.714rem 1.857rem;
		width: 25.643rem;
		min-height: 39.571rem;
	}

	.turnstile {
		min-height: 65px;
	}

	.sign-in {
		flex: 1;
		display: flex;
		gap: 5px;
		justify-content: center;
	}
</style>
