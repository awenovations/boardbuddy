<script lang="ts">
	import { goto } from '$app/navigation';
	import Icon from '@awenovations/aura/icon.svelte';
	import Button from '@awenovations/aura/button.svelte';
	import Tooltip from '@awenovations/aura/tooltip.svelte';
	import DarkModeImage from '$lib/assets/dark-mode-board.png';
	import LightModeImage from '$lib/assets/light-mode-board.png';
	import Container from '@awenovations/aura/container.svelte';

	let { children } = $props();
</script>

<div class="background-wrapper">
  <div class="backdrop"></div>
  <div class="background-image">
    <image class="dark-mode-image" src={DarkModeImage} />
    <image class="light-mode-image" src={LightModeImage} />
  </div>
</div>

<div class="wrapper">

	<div class="paywall-layout">
		<div class="paywall-logo">
			<div class="logo">
				<span class="name">Board Buddy</span>
				Simplify Your Workflow
			</div>
		</div>

		<Container variant="elevated" class="paywall-container" clearPadding>
			<div class="paywall-wrapper">
				<h1 class="paywall-header">
					Your trial is up! Unlock <br /> lifetime access for $30!
				</h1>

				{@render children?.()}

				<Button
					class="continue-button"
					fullWidth
					variant="tertiary"
					onclick={() => goto('/paywall/pay')}>Buy</Button
				>
				<a href="/" class="back-link">&larr; Back to website</a>
			</div>
		</Container>
	</div>
</div>

<style lang="ts">

  .background-wrapper {
    width: 100%;
    height: 100%;
    max-width: 100%;
    max-height: 100%;
    position: absolute;
    top: 0;
    left: 0;
    overflow: hidden;
  }

	.wrapper {
		display: flex;
		justify-content: center;
		flex-direction: column;
		height: 100%;
		align-items: center;
		overflow: hidden;
	}

	:global(.paywall-container) {
		margin: 0 auto -2rem;
		box-sizing: border-box;
		position: relative;
		z-index: 20;
	}

	:global(.right-user-actions) {
		position: relative;
		z-index: 30;
	}

	:global(button.aura-button.continue-button) {
		min-width: 21.429rem;
	}

	.paywall-logo {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 1rem;

		:global(.logo) {
			align-items: center;
		}
	}

	.back-link {
		flex: 1;
		color: var(--aura-link-color);
		text-decoration: none;
		font: var(--aura-default-regular);

		&:hover {
			text-decoration: underline;
		}
	}

	.paywall-layout {
		display: flex;
		flex-direction: column;
		gap: 2rem;
		transform: translateY(-6rem);
		position: relative;
		z-index: 20;
	}

	.backdrop {
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		max-width: 100%;
		max-height: 100%;
		z-index: 10;
		backdrop-filter: blur(0.714rem);

		@media (prefers-color-scheme: light) {
			background: rgba(230, 230, 230, 0.3);
		}

		@media (prefers-color-scheme: dark) {
			background: rgba(0, 0, 0, 0.5);
		}
	}

	.background-image {
		user-select: none;
		.light-mode-image,
		.dark-mode-image {
			position: absolute;
			top: 10.714rem;
			left: 50%;
			transform: translateX(-50%);
		}

		.dark-mode-image {
			@media (prefers-color-scheme: light) {
				display: none;
			}
		}
		.light-mode-image {
			@media (prefers-color-scheme: dark) {
				display: none;
			}
		}
	}

	.paywall-wrapper {
		box-sizing: border-box;

		.paywall-header {
			box-sizing: border-box;
			line-height: 1.5em;
		}

		padding: 2.286rem 4rem;
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 2.286rem;

		ul.value-proposition {
			display: flex;
			flex-direction: column;
			width: fit-content;
			gap: 1rem;

			li {
				font: var(--aura-h4);
				display: flex;
				align-items: center;
				gap: 1rem;
				& :global(.aura-icon .icon) {
					background: var(--aura-success-40) !important;
				}
			}
		}
	}
</style>
