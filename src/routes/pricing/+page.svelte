<script lang="ts">
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';
	import Container from '@awenovations/aura/container.svelte';
	import Button from '@awenovations/aura/button.svelte';
	import Icon from '@awenovations/aura/icon.svelte';

	const user = $derived($page.data.user);
	const ctaHref = $derived(user ? '/paywall/pay' : '/signup');
	const ctaLabel = $derived(user ? 'Get Lifetime Access' : 'Start Free Trial');
	const trialNote = $derived(
		user
			? 'One-time payment · No subscription'
			: '3-day free trial · No credit card required'
	);

	const features = [
		'Kanban board with drag & drop',
		'Unlimited tasks and projects',
		'Nested project organization',
		'Built-in diagram support via draw.io',
		'AI assistant integration via MCP server',
		'Works in your browser — no install needed'
	];
</script>

<div class="wrapper" data-theme="light">
	<nav class="navbar">
		<div class="nav-content">
			<a href="/" class="nav-logo">BB</a>
			<div class="nav-links">
				{#if user}
					<a href="/app" class="nav-link">Go to Board</a>
					<form method="POST" action="/signout" class="nav-signout-form">
						<button type="submit" class="nav-link">Sign out</button>
					</form>
				{:else}
					<span class="nav-link nav-link-current">Pricing</span>
					<a href="/docs" class="nav-link">Docs</a>
					<a href="/signin" class="nav-link">Login</a>
					<a href="/signup" class="nav-signup">Sign Up</a>
				{/if}
			</div>
		</div>
	</nav>

	<main class="pricing-main">
		<div class="pricing-hero">
			<div>
				<h1 class="hero-title">Board Buddy</h1>
				<p class="hero-tagline">Simplify Your Workflow</p>
			</div>
			<p class="hero-subtitle">Start free for 3 days — no credit card required</p>
		</div>

		<div class="pricing-grid">
			<Container variant="elevated" class="plan-card" clearPadding>
				<div class="plan-card-inner">
					<span class="plan-badge">Pay Once, Own Forever</span>
					<h2 class="plan-name">Lifetime Access</h2>
					<div class="plan-price">
						<span class="price-amount">$30</span>
						<span class="price-label">one-time</span>
					</div>
					<ul class="plan-features">
						{#each features as f}
							<li>
								<Icon name="checkmark" size="large" />
								{f}
							</li>
						{/each}
					</ul>
					<Button variant="tertiary" fullWidth class="plan-cta" onclick={() => goto(ctaHref)}>
						{ctaLabel}
					</Button>
					<p class="trial-note">{trialNote}</p>
				</div>
			</Container>
		</div>
	</main>

	<footer class="landing-footer">
		<div class="footer-inner">
			&copy; {new Date().getFullYear()} Benjamin Knox | Feedback:&nbsp;<a
				href="mailto:ben@knoxes.email"
				class="footer-link">ben@knoxes.email</a
			>&nbsp;| My Website:&nbsp;<a href="https://knox.pro" target="_blank" class="footer-link"
				>knox.pro</a
			>
		</div>
	</footer>
</div>

<style lang="scss">
	.wrapper {
		min-height: 100vh;
		display: flex;
		flex-direction: column;
		background: var(--aura-light-background);
	}

	/* ========== Navbar ========== */
	.navbar {
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		z-index: 50;
		background: rgba(255, 255, 255, 0.95);
		backdrop-filter: blur(8px);
		border-bottom: 1px solid var(--aura-container-border-color);
	}

	.nav-content {
		max-width: 80rem;
		margin: 0 auto;
		padding: 1rem 1.5rem;
		display: flex;
		justify-content: space-between;
		align-items: center;
	}

	.nav-logo {
		font: var(--aura-h3);
		color: var(--aura-secondary-40);
		text-decoration: none;
	}

	.nav-links {
		display: flex;
		align-items: center;
		gap: 0.75rem;
	}

	.nav-signout-form {
		display: inline;
	}

	.nav-link {
		color: var(--aura-tertiary-60);
		padding: 0.5rem 1.25rem;
		border-radius: 0.5rem;
		font: var(--aura-default-regular);
		text-decoration: none;
		background: none;
		border: none;
		cursor: pointer;
		transition: color 0.2s;

		&:hover {
			color: var(--aura-secondary-40);
		}

		&.nav-link-current {
			color: var(--aura-secondary-40);
			font: var(--aura-default-semibold);
			cursor: default;
		}
	}

	.nav-signup {
		background: var(--aura-secondary-40);
		color: white;
		padding: 0.5rem 1.25rem;
		border-radius: 0.5rem;
		font: var(--aura-default-semibold);
		text-decoration: none;
		transition: background-color 0.2s;

		&:hover {
			background: var(--aura-tertiary-60);
		}
	}

	/* ========== Main ========== */
	.pricing-main {
		flex: 1;
		padding: 8rem 1.5rem 6rem;
		max-width: 80rem;
		margin: 0 auto;
		width: 100%;
		box-sizing: border-box;
	}

	.pricing-hero {
		text-align: center;
		margin-bottom: 1.5rem;
		display: flex;
		flex-direction: column;
		gap: 1.5rem;
	}

	.hero-title {
		font: var(--aura-display1);
		color: var(--aura-secondary-40);
		margin-bottom: 0.25rem;
	}

	.hero-tagline {
		font: var(--aura-h3);
		color: var(--aura-secondary-40);
		margin-bottom: 1rem;
	}

	.hero-subtitle {
		font: var(--aura-default-regular);
		color: var(--aura-tertiary-60);
		font-size: 1.125rem;
	}

	/* ========== Pricing Grid ========== */
	.pricing-grid {
		display: flex;
		flex-wrap: wrap;
		justify-content: center;
		gap: 2rem;
	}

	:global(.plan-card) {
		max-width: 36rem;
		width: 100%;
	}

	.plan-card-inner {
		padding: 2.5rem;
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 1.5rem;
	}

	.plan-badge {
		background: var(--aura-secondary-40);
		color: white;
		border-radius: 999px;
		padding: 0.25rem 0.75rem;
		font: var(--aura-default-semibold);
		font-size: 0.8rem;
	}

	.plan-name {
		font: var(--aura-h3);
		color: black;
	}

	.plan-price {
		display: flex;
		align-items: baseline;
		gap: 0.5rem;

		.price-amount {
			font: var(--aura-display1);
			color: black;
		}

		.price-label {
			font: var(--aura-default-regular);
			color: var(--aura-tertiary-60);
		}
	}

	.plan-features {
		display: flex;
		flex-direction: column;
		width: 100%;
		gap: 1rem;

		li {
			font: var(--aura-default-regular);
			display: flex;
			align-items: center;
			gap: 1rem;

			& :global(.aura-icon .icon) {
				background: var(--aura-success-40) !important;
			}
		}
	}

	:global(button.aura-button.plan-cta) {
		width: 100%;
	}

	.trial-note {
		font: var(--aura-default-regular);
		color: var(--aura-tertiary-60);
		text-align: center;
		font-size: 0.875rem;
	}

	/* ========== Footer ========== */
	.landing-footer {
		padding: 2rem 1.5rem;
		border-top: 1px solid var(--aura-container-border-color);
	}

	.footer-inner {
		max-width: 80rem;
		margin: 0 auto;
		text-align: center;
		font: var(--aura-default-regular);
		color: var(--aura-tertiary-60);
	}

	.footer-link {
		color: var(--aura-link-color);
		text-decoration: none;

		&:hover {
			text-decoration: underline;
		}
	}
</style>
