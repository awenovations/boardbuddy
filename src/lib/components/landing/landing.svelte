<script lang="ts">
	import Link from '@awenovations/aura/link.svelte';
	import Icon from '@awenovations/aura/icon.svelte';
	import Button from '@awenovations/aura/button.svelte';
	import Panel from '@awenovations/aura/panel.svelte';
	import Tooltip from '@awenovations/aura/tooltip.svelte';
	import screenshot from '$lib/assets/screenshot.svg';

	import PersonalInfo from '$lib/components/settings/personal-info/personal-info.svelte';
	import DeleteAccount from '$lib/components/settings/delete-account/delete-account.svelte';
	import AccountManagement from '$lib/components/settings/account-management/account-management.svelte';

	let { session = null }: { session?: any } = $props();

	let settingsOpen = $state(false);

	const toggleSettings = () => {
		settingsOpen = !settingsOpen;
	};
</script>

<div class="wrapper" data-theme="light">
	<!-- Nav Bar -->
	<nav class="navbar">
		<div class="nav-content">
			<span class="nav-logo">BB</span>
			<div class="nav-links">
				{#if session?.user}
					<a href="/app" class="nav-link">Go to Board</a>
					<form method="POST" action="/signout" class="nav-signout-form">
						<Button
							type="submit"
							kind="outlined"
							variant="secondary"
							size="small"
							data-cy="sign-out"
							class="sign-out">Sign out</Button
						>
					</form>
					<Tooltip content="Account Settings" placement="bottom-end">
						<Link onclick={toggleSettings}>
							<Icon name="settings" size="large" />
						</Link>
					</Tooltip>
				{:else}
					<!--<a href="#pricing" class="nav-link">Pricing</a>-->
					<a href="/signin" class="nav-link">Login</a>
					<a href="/signup" class="nav-signup">Sign Up</a>
				{/if}
			</div>
		</div>
	</nav>

	<!-- Hero Section -->
	<section class="hero">
		<div class="hero-bg-decoration"></div>
		<div class="hero-content">
			<h1 class="hero-title">Board Buddy</h1>
			<p class="hero-tagline">Simplify Your Workflow</p>
			<p class="hero-description">
				The modern task management tool that helps teams stay organized and productive. Manage
				projects with ease using our intuitive kanban board interface.
			</p>
			<div class="hero-buttons">
				<a href="/signup" class="cta-primary">
					Get Started
					<svg
						xmlns="http://www.w3.org/2000/svg"
						width="20"
						height="20"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						stroke-width="2"
						stroke-linecap="round"
						stroke-linejoin="round"><path d="M5 12h14" /><path d="m12 5 7 7-7 7" /></svg
					>
				</a>
				<!-- <a href="#demo" class="cta-outlined">Watch Demo</a> -->
			</div>
		</div>
	</section>

	<!-- Features Section -->
	<section class="features">
		<div class="features-inner">
			<div class="section-header">
				<h2 class="section-title">Everything you need to succeed</h2>
				<p class="section-subtitle">
					Powerful features designed to help your team work smarter, not harder
				</p>
			</div>

			<div class="features-grid">
				<div class="feature-card">
					<div class="feature-icon">
						<svg
							xmlns="http://www.w3.org/2000/svg"
							width="24"
							height="24"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							stroke-width="2"
							stroke-linecap="round"
							stroke-linejoin="round"><path d="M13 2 3 14h9l-1 8 10-12h-9l1-8z" /></svg
						>
					</div>
					<h3 class="feature-title">Simplify your workflow in minutes</h3>
					<p class="feature-description">
						Get started quickly with an intuitive interface that requires no training. Create
						boards, add tasks, and start collaborating instantly.
					</p>
				</div>

				<div class="feature-card">
					<div class="feature-icon">
						<svg
							xmlns="http://www.w3.org/2000/svg"
							width="24"
							height="24"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							stroke-width="2"
							stroke-linecap="round"
							stroke-linejoin="round"
							><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><path d="m9 11 3 3L22 4" /></svg
						>
					</div>
					<h3 class="feature-title">Manage tasks easily, no complexity</h3>
					<p class="feature-description">
						Drag and drop tasks between columns, assign team members, and track progress with our
						streamlined kanban board.
					</p>
				</div>

				<div class="feature-card">
					<div class="feature-icon">
						<svg
							xmlns="http://www.w3.org/2000/svg"
							width="24"
							height="24"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							stroke-width="2"
							stroke-linecap="round"
							stroke-linejoin="round"
							><rect width="18" height="18" x="3" y="4" rx="2" ry="2" /><line
								x1="16"
								x2="16"
								y1="2"
								y2="6"
							/><line x1="8" x2="8" y1="2" y2="6" /><line x1="3" x2="21" y1="10" y2="10" /></svg
						>
					</div>
					<h3 class="feature-title">Streamline sprints, ditch Jira chaos</h3>
					<p class="feature-description">
						Built for agile teams who need powerful features without overwhelming complexity.
						Perfect for modern development workflows.
					</p>
				</div>

				<div class="feature-card">
					<div class="feature-icon">
						<svg
							xmlns="http://www.w3.org/2000/svg"
							width="24"
							height="24"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							stroke-width="2"
							stroke-linecap="round"
							stroke-linejoin="round"
							><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle
								cx="9"
								cy="7"
								r="4"
							/><path d="M22 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></svg
						>
					</div>
					<h3 class="feature-title">Seamless team collaboration</h3>
					<p class="feature-description">
						Work together in real-time with your team. Assign tasks, add comments, and keep everyone
						on the same page.
					</p>
				</div>

				<div class="feature-card">
					<div class="feature-icon">
						<svg
							xmlns="http://www.w3.org/2000/svg"
							width="24"
							height="24"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							stroke-width="2"
							stroke-linecap="round"
							stroke-linejoin="round"
							><line x1="12" x2="12" y1="20" y2="10" /><line x1="18" x2="18" y1="20" y2="4" /><line
								x1="6"
								x2="6"
								y1="20"
								y2="16"
							/></svg
						>
					</div>
					<h3 class="feature-title">Track progress with insights</h3>
					<p class="feature-description">
						Monitor your team's productivity with built-in analytics and reporting. See what's
						working and what needs attention.
					</p>
				</div>

				<div class="feature-card">
					<div class="feature-icon">
						<svg
							xmlns="http://www.w3.org/2000/svg"
							width="24"
							height="24"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							stroke-width="2"
							stroke-linecap="round"
							stroke-linejoin="round"
							><rect width="18" height="11" x="3" y="11" rx="2" ry="2" /><path
								d="M7 11V7a5 5 0 0 1 10 0v4"
							/></svg
						>
					</div>
					<h3 class="feature-title">Secure and reliable</h3>
					<p class="feature-description">
						Your data is protected with enterprise-grade security. Work with confidence knowing your
						information is safe and accessible.
					</p>
				</div>
			</div>
		</div>
	</section>

	<!-- Product Preview Section -->
	<section class="preview">
		<div class="preview-inner">
			<div class="section-header">
				<h2 class="section-title">See Board Buddy in action</h2>
				<p class="section-subtitle">Organize your work with our intuitive kanban board interface</p>
			</div>

			<div class="browser-mockup">
				<div class="browser-chrome">
					<div class="browser-dots">
						<span class="dot dot-red"></span>
						<span class="dot dot-yellow"></span>
						<span class="dot dot-green"></span>
					</div>
					<div class="browser-url">boardbuddy.cloud/app</div>
				</div>

				<div class="browser-content">
					<img src={screenshot} />
				</div>
			</div>

			<div class="preview-blur-left"></div>
			<div class="preview-blur-right"></div>
		</div>
	</section>

	<!-- CTA Section -->
	<section class="cta-section">
		<div class="cta-banner">
			<div class="cta-bg-pattern">
				<div class="cta-bg-circle cta-bg-circle-top"></div>
				<div class="cta-bg-circle cta-bg-circle-bottom"></div>
			</div>
			<div class="cta-content">
				<h2 class="cta-title">Ready to simplify your workflow?</h2>
				<p class="cta-subtitle">
					Stop wrestling with overcomplicated tools and start managing tasks the simple way
				</p>
				<div class="cta-benefits">
					<div class="benefit">
						<svg
							xmlns="http://www.w3.org/2000/svg"
							width="20"
							height="20"
							viewBox="0 0 24 24"
							fill="none"
							stroke="#28c840"
							stroke-width="2"
							stroke-linecap="round"
							stroke-linejoin="round"
							><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><path d="m9 11 3 3L22 4" /></svg
						>
						<span>No credit card required</span>
					</div>
					<div class="benefit">
						<svg
							xmlns="http://www.w3.org/2000/svg"
							width="20"
							height="20"
							viewBox="0 0 24 24"
							fill="none"
							stroke="#28c840"
							stroke-width="2"
							stroke-linecap="round"
							stroke-linejoin="round"
							><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><path d="m9 11 3 3L22 4" /></svg
						>
						<span>Setup in minutes</span>
					</div>
					<div class="benefit">
						<svg
							xmlns="http://www.w3.org/2000/svg"
							width="20"
							height="20"
							viewBox="0 0 24 24"
							fill="none"
							stroke="#28c840"
							stroke-width="2"
							stroke-linecap="round"
							stroke-linejoin="round"
							><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><path d="m9 11 3 3L22 4" /></svg
						>
						<span>Cancel anytime</span>
					</div>
				</div>
				<div class="cta-buttons">
					<a href="/signup" class="cta-btn-white">
						Start Free Trial
						<svg
							xmlns="http://www.w3.org/2000/svg"
							width="20"
							height="20"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							stroke-width="2"
							stroke-linecap="round"
							stroke-linejoin="round"><path d="M5 12h14" /><path d="m12 5 7 7-7 7" /></svg
						>
					</a>
					<!-- <a href="#pricing" class="cta-btn-outline">View Pricing</a> -->
				</div>
			</div>
		</div>
	</section>

	<!-- Footer -->
	<footer class="landing-footer">
		<div class="footer-inner">
			&copy; {new Date().getFullYear()} Benjamin Knox | Feedback:&nbsp;<Link
				href="mailto:ben@knoxes.email">ben@knoxes.email</Link
			>&nbsp;| My Website:&nbsp;<Link target="blank" href="https://knox.pro">knox.pro</Link>
		</div>
	</footer>
</div>

{#if session?.user}
	<Panel width="19vw" open={settingsOpen} class="settings-panel">
		<div class="settings-wrapper">
			<h2>
				Settings
				<Button size="small" onclick={toggleSettings}>Close</Button>
			</h2>
			<PersonalInfo user={session.user} />
			<AccountManagement user={session.user} />
			<DeleteAccount user={session.user} />
		</div>
	</Panel>
{/if}

<style lang="scss">
  .wrapper {
    background: var(--aura-light-background);
  }
	/* ========== Nav Bar ========== */
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
	}

	.nav-links {
		display: flex;
		align-items: center;
		gap: 0.75rem;
	}

	.nav-signout-form {
		display: inline;
	}

	:global(.settings-panel) {
		z-index: 1000;
		max-width: 25.714rem;
	}

	.settings-wrapper {
		padding: 1.5rem;
		box-sizing: border-box;
		display: flex;
		flex-direction: column;
		gap: 1rem;
		width: var(--width);
		white-space: normal;

		:global(.aura-button .content) {
			justify-content: center;
		}

		h2 {
			display: flex;
			justify-content: space-between;
		}
	}

	:global(.sign-out) {
		margin-right: 0.071rem;
	}

	.nav-link {
		color: var(--aura-tertiary-60);
		padding: 0.5rem 1.25rem;
		border-radius: 0.5rem;
		font: var(--aura-default-regular);
		text-decoration: none;
		transition: color 0.2s;

		&:hover {
			color: var(--aura-secondary-40);
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

	/* ========== Hero Section ========== */
	.hero {
		position: relative;
		overflow: hidden;
		padding: 10rem 1.5rem 8rem;
	}

	.hero-bg-decoration {
		position: absolute;
		top: -50%;
		left: 50%;
		transform: translateX(-50%);
		width: 50rem;
		height: 50rem;
		border-radius: 50%;
		background: radial-gradient(circle, var(--aura-secondary-40) 0%, transparent 70%);
		opacity: 0.15;
		filter: blur(80px);
		pointer-events: none;
	}

	.hero-content {
		position: relative;
		max-width: 80rem;
		margin: 0 auto;
		display: flex;
		flex-direction: column;
		align-items: center;
		text-align: center;
	}

	.hero-title {
		font: var(--aura-display1);
		color: var(--aura-secondary-40);
		margin-bottom: 1rem;
	}

	.hero-tagline {
		font: var(--aura-h3);
		color: var(--aura-secondary-40);
		margin-bottom: 1rem;
	}

	.hero-description {
		font: var(--aura-default-regular);
		color: var(--aura-tertiary-60);
		max-width: 40rem;
		margin-bottom: 3rem;
		line-height: 1.6;
		font-size: 1.125rem;
	}

	.hero-buttons {
		display: flex;
		gap: 1rem;
	}

	.cta-primary {
		display: inline-flex;
		align-items: center;
		gap: 0.75rem;
		background: var(--aura-tertiary-60);
		color: white;
		padding: 1rem 2rem;
		border-radius: 0.5rem;
		font: var(--aura-default-semibold);
		font-size: 1.125rem;
		text-decoration: none;
		transition: all 0.2s;
		box-shadow: 0 4px 14px rgba(0, 0, 0, 0.15);

		&:hover {
			background: var(--aura-secondary-40);
			transform: scale(1.05);
		}

		svg {
			transition: transform 0.2s;
		}

		&:hover svg {
			transform: translateX(4px);
		}
	}

	.cta-outlined {
		display: inline-flex;
		align-items: center;
		border: 2px solid var(--aura-tertiary-60);
		color: var(--aura-tertiary-60);
		padding: 1rem 2rem;
		border-radius: 0.5rem;
		font: var(--aura-default-semibold);
		font-size: 1.125rem;
		text-decoration: none;
		transition: all 0.2s;

		&:hover {
			background: var(--aura-tertiary-60);
			color: white;
		}
	}

	/* ========== Features Section ========== */
	.features {
		padding: 6rem 1.5rem;
		background: var(--aura-container-background);
	}

	.features-inner {
		max-width: 80rem;
		margin: 0 auto;
	}

	.section-header {
		text-align: center;
		margin-bottom: 4rem;
	}

	.section-title {
		font: var(--aura-display2);
		color: var(--aura-secondary-40);
		margin-bottom: 1rem;
	}

	.section-subtitle {
		font: var(--aura-default-regular);
		color: var(--aura-tertiary-50);
		font-size: 1.125rem;
	}

	.features-grid {
		display: grid;
		grid-template-columns: repeat(3, 1fr);
		gap: 2rem;
	}

	.feature-card {
		background: var(--aura-container-background);
		padding: 2rem;
		border-radius: var(--aura-container-border-radius);
		border: 1px solid var(--aura-container-border-color);
		transition: all 0.3s;

		&:hover {
			border-color: var(--aura-secondary-40);
			box-shadow: 0 10px 30px rgba(0, 0, 0, 0.08);
		}

		&:hover .feature-icon {
			background: var(--aura-secondary-40);
			color: white;
		}
	}

	.feature-icon {
		display: inline-flex;
		padding: 0.75rem;
		border-radius: 0.5rem;
		background: color-mix(in srgb, var(--aura-secondary-40) 10%, transparent);
		color: var(--aura-secondary-40);
		margin-bottom: 1rem;
		transition: all 0.3s;
	}

	.feature-title {
		font: var(--aura-h3);
		color: var(--aura-tertiary-70);
		margin-bottom: 0.75rem;
		font-size: 1.25rem;
	}

	.feature-description {
		font: var(--aura-default-regular);
		color: var(--aura-tertiary-50);
		line-height: 1.6;
	}

	/* ========== Product Preview Section ========== */
	.preview {
		padding: 6rem 1.5rem;
		background: var(--aura-background);
	}

	.preview-inner {
		max-width: 80rem;
		margin: 0 auto;
		position: relative;
	}

	.browser-mockup {
		background: var(--aura-container-background);
		border-radius: 0.75rem;
		box-shadow: 0 25px 50px rgba(0, 0, 0, 0.15);
		overflow: hidden;
		border: 1px solid var(--aura-container-border-color);
		max-width: 72rem;
		margin: 0 auto;
	}

	.browser-chrome {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		background: #e6e6e6;
		padding: 0.75rem 1rem;
		border-bottom: 1px solid var(--aura-container-border-color);
	}

	.browser-dots {
		display: flex;
		gap: 0.5rem;
	}

	.dot {
		width: 0.75rem;
		height: 0.75rem;
		border-radius: 50%;
	}

	.dot-red {
		background: #ff5f57;
	}
	.dot-yellow {
		background: #febc2e;
	}
	.dot-green {
		background: #28c840;
	}

	.browser-url {
		flex: 1;
		margin: 0 1rem;
		background: var(--aura-container-background);
		border-radius: 0.25rem;
		padding: 0.25rem 0.75rem;
		font: var(--aura-default-regular);
		color: var(--aura-tertiary-50);
		font-size: 0.875rem;
	}

	.browser-content {
		background: var(--aura-background);
		img {
			width: 100%;
		}
	}

	.preview-header {
		display: flex;
		align-items: center;
		justify-content: space-between;
		margin-bottom: 2rem;
	}

	.preview-logo {
		font: var(--aura-h3);
		color: var(--aura-secondary-40);
		margin-bottom: 0.25rem;
	}

	.preview-tagline {
		font: var(--aura-default-regular);
		color: var(--aura-tertiary-50);
		font-size: 0.875rem;
	}

	.preview-actions {
		display: flex;
		align-items: center;
		gap: 0.75rem;
	}

	.preview-filter {
		background: var(--aura-container-background);
		border: 1px solid var(--aura-container-border-color);
		border-radius: 0.375rem;
		padding: 0.5rem 1rem;
		font: var(--aura-default-regular);
		color: var(--aura-tertiary-50);
		font-size: 0.875rem;
	}

	.preview-signout {
		background: var(--aura-tertiary-60);
		color: white;
		padding: 0.5rem 1rem;
		border-radius: 0.375rem;
		font: var(--aura-default-semibold);
		font-size: 0.875rem;
	}

	.kanban-board {
		display: grid;
		grid-template-columns: repeat(4, 1fr);
		gap: 1rem;
	}

	.kanban-column {
		background: var(--aura-background);
		border-radius: 0.5rem;
		border: 1px solid var(--aura-container-border-color);
		padding: 1rem;
	}

	.column-header {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		margin-bottom: 1rem;

		h4 {
			font: var(--aura-default-semibold);
			font-size: 1.125rem;
			color: var(--aura-font-color);
		}
	}

	.column-count {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		width: 1.25rem;
		height: 1.25rem;
		border-radius: 50%;
		background: var(--aura-container-border-color);
		color: white;
		font-size: 0.75rem;
	}

	.kanban-cards {
		display: flex;
		flex-direction: column;
		gap: 0.75rem;
	}

	.kanban-card {
		background: var(--aura-container-background);
		border-radius: 0.5rem;
		border: 1px solid var(--aura-container-border-color);
		padding: 0.75rem;
		box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
		transition: box-shadow 0.2s;
		cursor: pointer;

		&:hover {
			box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
		}

		h5 {
			font: var(--aura-default-semibold);
			font-size: 0.875rem;
			color: var(--aura-font-color);
			margin-bottom: 0.5rem;
		}
	}

	.card-desc {
		font: var(--aura-default-regular);
		color: var(--aura-tertiary-50);
		font-size: 0.75rem;
		margin-bottom: 0.5rem;
	}

	.card-meta {
		display: flex;
		align-items: center;
		justify-content: space-between;
		font: var(--aura-default-regular);
		color: var(--aura-tertiary-50);
		font-size: 0.75rem;
	}

	.preview-blur-left,
	.preview-blur-right {
		position: absolute;
		width: 16rem;
		height: 16rem;
		border-radius: 50%;
		background: radial-gradient(circle, var(--aura-secondary-40) 0%, transparent 70%);
		opacity: 0.15;
		filter: blur(60px);
		pointer-events: none;
		z-index: -1;
	}

	.preview-blur-left {
		top: -2rem;
		left: -2rem;
	}

	.preview-blur-right {
		bottom: -2rem;
		right: -2rem;
	}

	/* ========== CTA Section ========== */
	.cta-section {
		padding: 6rem 1.5rem;
		background: var(--aura-container-background);
	}

	.cta-banner {
		max-width: 56rem;
		margin: 0 auto;
		background: linear-gradient(135deg, var(--aura-secondary-40), var(--aura-tertiary-60));
		border-radius: 1rem;
		padding: 3rem;
		overflow: hidden;
		position: relative;
		box-shadow: 0 25px 50px rgba(0, 0, 0, 0.15);
	}

	.cta-bg-pattern {
		position: absolute;
		inset: 0;
		opacity: 0.1;
	}

	.cta-bg-circle {
		position: absolute;
		width: 16rem;
		height: 16rem;
		background: white;
		border-radius: 50%;
		filter: blur(60px);
	}

	.cta-bg-circle-top {
		top: 0;
		left: 0;
	}

	.cta-bg-circle-bottom {
		bottom: 0;
		right: 0;
	}

	.cta-content {
		position: relative;
		z-index: 1;
		text-align: center;
	}

	.cta-title {
		font: var(--aura-display2);
		color: white;
		margin-bottom: 1rem;
	}

	.cta-subtitle {
		font: var(--aura-default-regular);
		color: rgba(255, 255, 255, 0.9);
		font-size: 1.125rem;
		margin-bottom: 2rem;
	}

	.cta-benefits {
		display: flex;
		justify-content: center;
		gap: 1.5rem;
		margin-bottom: 2.5rem;
		flex-wrap: wrap;
	}

	.benefit {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		color: white;
		font: var(--aura-default-regular);
	}

	.cta-buttons {
		display: flex;
		justify-content: center;
		gap: 1rem;
		flex-wrap: wrap;
	}

	.cta-btn-white {
		display: inline-flex;
		align-items: center;
		gap: 0.75rem;
		background: white;
		color: var(--aura-secondary-40);
		padding: 1rem 2.5rem;
		border-radius: 0.5rem;
		font: var(--aura-default-semibold);
		font-size: 1.125rem;
		text-decoration: none;
		transition: all 0.2s;
		box-shadow: 0 4px 14px rgba(0, 0, 0, 0.15);

		&:hover {
			transform: scale(1.05);
		}

		svg {
			transition: transform 0.2s;
		}

		&:hover svg {
			transform: translateX(4px);
		}
	}

	.cta-btn-outline {
		display: inline-flex;
		align-items: center;
		border: 2px solid white;
		color: white;
		padding: 1rem 2.5rem;
		border-radius: 0.5rem;
		font: var(--aura-default-semibold);
		font-size: 1.125rem;
		text-decoration: none;
		transition: all 0.2s;

		&:hover {
			background: white;
			color: var(--aura-secondary-40);
		}
	}

	/* ========== Footer ========== */
	.landing-footer {
		background: var(--aura-tertiary-60);
		display: flex;
		flex-direction: column;
		justify-content: center;
		height: 8rem;
	}

	.footer-inner {
		max-width: 80rem;
		margin: 0 auto;
		display: flex;
		justify-content: center;
		align-items: flex-start;
		color: rgba(255, 255, 255, 0.7);
		font: var(--aura-default-regular);
		font-size: 0.75rem;

		:global(.aura-link) {
			color: rgba(255, 255, 255, 0.85) !important;
			font-size: 0.75rem;

			&:hover {
				color: white !important;
			}
		}
	}

	/* ========== Responsive ========== */
	@media (max-width: 768px) {
		.features-grid {
			grid-template-columns: 1fr;
		}

		.kanban-board {
			grid-template-columns: repeat(2, 1fr);
		}

		.hero-buttons {
			flex-direction: column;
		}

		.cta-benefits {
			flex-direction: column;
			align-items: center;
		}
	}
</style>
