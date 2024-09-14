<script lang="ts">
	import Link from '@awenovations/aura/link.svelte';
	import Icon from '@awenovations/aura/icon.svelte';
	import Tooltip from '@awenovations/aura/tooltip.svelte';
	import Container from '@awenovations/aura/container.svelte';

	export let name: string;
	export let handleCreateTask: (type: string) => void;

	const handleCreateTaskElement = () => {
		handleCreateTask(name);
	};
</script>

<div cy-test="column" class="column-wrapper">
	<h2 cy-test="column-header">
		{name}
		<span class="create-button">
			<Tooltip placement="top-start" content="Click to add a card">
				<Link on:click={handleCreateTaskElement} cy-test="add-button"
					><Icon class="bg" name="circle-plus" /></Link
				>
			</Tooltip>
		</span>
	</h2>
	<Container kind="outlined" class="card-container"></Container>
</div>

<style lang="scss">
	.column-wrapper {
		width: 13.563rem;
		display: flex;
		flex-direction: column;
		align-items: stretch;
		height: 100%;

		:global(.card-container) {
			flex: 1;
			width: auto;
		}

		h2 {
			margin-bottom: -0.5rem;
			z-index: 0;
			display: flex;
			align-items: center;
			justify-content: center;
			gap: 0.5rem;
		}

    .create-button {
      font: var(--aura-default-regular);

      & :global(.aura-icon .icon) {
        background: var(--aura-tertiary-30);
      }
    }
	}
</style>
