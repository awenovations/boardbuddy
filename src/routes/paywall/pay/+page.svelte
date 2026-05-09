<script lang="ts">
	import { loadStripe } from '@stripe/stripe-js';
	import { env } from '$env/dynamic/public';
	import { page } from '$app/stores';
	import Container from '@awenovations/aura/container.svelte';
	import TextField from '@awenovations/aura/text-field.svelte';
	import Button from '@awenovations/aura/button.svelte';
	import Link from '@awenovations/aura/link.svelte';

	let { data } = $props();

	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	let stripe = $state<any>(null);
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	let elements = $state<any>(null);
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	let paymentElement = $state<any>(null);
	let paymentElementContainer: HTMLDivElement;
	let email = $state(data.userEmail ?? '');
	let loading = $state(false);
	let errorMessage = $state(data.paymentError ?? '');

	$effect(() => {
		let active = true;

		const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

		(async () => {
			const stripeInstance = await loadStripe(env.PUBLIC_STRIPE_PUBLISHABLE_KEY);
			if (!active || !stripeInstance) return;

			stripe = stripeInstance;

			const elementsInstance = stripeInstance.elements({
				clientSecret: data.clientSecret!,
				appearance: { theme: isDark ? 'night' : 'stripe' }
			});

			elements = elementsInstance;

			const pe = elementsInstance.create('payment');
			pe.mount(paymentElementContainer);
			pe.on('change', (event: any) => {
				if (!event.empty) {
					errorMessage = event.error?.message ?? '';
				}
			});
			paymentElement = pe;
		})();

		return () => {
			active = false;
			paymentElement?.unmount?.();
		};
	});

	const handleSubmit = async () => {
		if (!stripe || !elements) return;

		loading = true;
		errorMessage = '';

		const { error } = await stripe.confirmPayment({
			elements,
			confirmParams: {
				return_url: `${$page.url.origin}/paywall/pay/success`,
				payment_method_data: {
					billing_details: { email }
				}
			}
		});

		if (error) {
			errorMessage = error.message ?? 'Payment failed. Please try again.';
		}

		loading = false;
	};
</script>

<Container kind="filled" variant="elevated" class="pay-container" clearPadding>
	<div class="content-wrapper">
		<form onsubmit={(e) => { e.preventDefault(); handleSubmit(); }}>
			<div class="form-group">
				<TextField
					name="email"
					type="email"
					placeholder="email@example.com"
					value={email}
					oninput={(e) => (email = e.currentTarget.value)}
				>
					{#snippet label()}<span>Email</span>{/snippet}
				</TextField>

				<div bind:this={paymentElementContainer} class="stripe-element"></div>
			</div>

			{#if errorMessage}
				<div class="error-banner" role="alert">
					<span class="error-icon">!</span>
					<span>{errorMessage}</span>
				</div>
			{/if}

			<Button type="submit" {loading} fullWidth variant="tertiary">Pay</Button>
		</form>

		<p class="terms">
			By clicking Pay, you agree to the <a href="https://stripe.com/legal/consumer" target="_blank" rel="noopener noreferrer">Link Terms</a> and
			<a href="https://stripe.com/privacy" target="_blank" rel="noopener noreferrer">Privacy Policy</a>.
		</p>

		<Link href="/paywall">&larr; Back</Link>
	</div>
</Container>

<style lang="scss">
	:global(.pay-container) {
		margin: 0 auto;
		position: relative;
		z-index: 20;
	}

  :global(.wrapper) {
    height: fit-content!important;
    min-height: 100%;
  }

  :global(.paywall-layout) {
    transform: none!important;
  }

	.content-wrapper {
		box-sizing: border-box;
		padding: 2.5rem 3rem;
		width: 30rem;
		display: flex;
		flex-direction: column;
		gap: 1.5rem;
	}

	form {
		display: flex;
		flex-direction: column;
		gap: 1.5rem;
	}

	.form-group {
		display: flex;
		flex-direction: column;
		gap: 1.214rem;
	}

	.stripe-element {
		min-height: 18rem;
	}

	.error-banner {
		display: flex;
		align-items: center;
		gap: 0.75rem;
		padding: 0.75rem 1rem;
		border-radius: 0.5rem;
		background: color-mix(in srgb, var(--aura-error-40) 15%, transparent);
		border: 1px solid color-mix(in srgb, var(--aura-error-40) 40%, transparent);
		color: var(--aura-error-40);
		font: var(--aura-default-regular);
		font-size: 0.875rem;

		.error-icon {
			flex-shrink: 0;
			width: 1.25rem;
			height: 1.25rem;
			border-radius: 50%;
			border: 1.5px solid var(--aura-error-40);
			display: flex;
			align-items: center;
			justify-content: center;
			font-size: 0.75rem;
			font-weight: bold;
			line-height: 1;
		}
	}

	.terms {
		font: var(--aura-default-regular);
		font-size: 0.75rem;
		text-align: center;
		color: var(--aura-font-color);
		opacity: 0.7;

		a {
			color: var(--aura-link-color);
			text-decoration: none;

			&:hover {
				text-decoration: underline;
			}
		}
	}
</style>
