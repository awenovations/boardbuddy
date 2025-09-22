<script lang="ts">
  import Button from '@awenovations/aura/button.svelte';
	import Icon from '@awenovations/aura/icon.svelte';
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
    <Button fullWidth variant="tertiary">Continue</Button>
	</div>
</Container>

<style lang="ts">
	:global(.paywall-container) {
		margin: 0 auto -2rem;
		box-sizing: border-box;
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
