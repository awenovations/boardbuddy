<script lang="ts">
	import Icon from '@awenovations/aura/icon.svelte';
	import Button from '@awenovations/aura/button.svelte';
	import Tooltip from '@awenovations/aura/tooltip.svelte';
	import DarkModeImage from '$lib/assets/dark-mode-board.png';
	import LightModeImage from '$lib/assets/light-mode-board.png';
	import Container from '@awenovations/aura/container.svelte';
</script>

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

<style lang="ts">
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
</style>
