<script lang="ts">
	import { goto } from '$app/navigation';
	import Icon from '@awenovations/aura/icon.svelte';
	import Button from '@awenovations/aura/button.svelte';
	import Container from '@awenovations/aura/container.svelte';
</script>

<Container variant="elevated" class="paywall-container" clearPadding>
	<div class="paywall-wrapper">
		<h1 class="paywall-header">
			Your trial is up! Unlock <br /> lifetime access for $30!
		</h1>

		<ul class="value-proposition">
			<li>
				<Icon name="checkmark" size="large" />
				Simplify your workflow in minutes
			</li>
			<li>
				<Icon name="checkmark" size="large" />
				Manage tasks easily, no complexity
			</li>
			<li>
				<Icon name="checkmark" size="large" />
				Streamline sprints, ditch Jira chaos
			</li>
			<li>
				<Icon name="checkmark" size="large" />
				One-time payment, forever access
			</li>
			<li>
				<Icon name="checkmark" size="large" />
				Free updates keep you productive
			</li>
		</ul>

		<Button
			class="continue-button"
			fullWidth
			variant="tertiary"
			onclick={() => goto('/paywall/pay')}>Buy</Button
		>
		<a href="/" class="back-link">&larr; Back to website</a>
	</div>
</Container>

<style lang="scss">
	:global(.paywall-container) {
		margin: 0 auto -2rem;
		box-sizing: border-box;
		position: relative;
		z-index: 20;
	}

	:global(button.aura-button.continue-button) {
		min-width: 21.429rem;
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
