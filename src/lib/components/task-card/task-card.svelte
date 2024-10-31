<script lang="ts">
	import Container from '@awenovations/aura/container.svelte';
	import Icon from '@awenovations/aura/icon.svelte';

	export let title: string;
	export let body: string;
	export let assignee: string;
	export let type = 'user story';
</script>

<Container data-cy="task-card" clearPadding variant="elevated">
	<div class="card">
		<h4 class="card-title" data-cy="task-card-title">{title}</h4>
		<span class="card-body" data-cy="task-card-body">{body}</span>
		<span class="card-assignee" data-cy="task-card-assignee">Assigned to <i>{assignee}</i></span>
		<span class="card-type" data-cy="task-card-type"
			><span class="card-type-text">{type}</span>
			{#if type === 'user story'}
				<Icon name="user-story" />
			{:else if type === 'bug fix'}
				<Icon name="bug" />
			{:else}
				<Icon name="plan" />
			{/if}
		</span>
	</div>
</Container>

<style lang="scss">
	.card {
		height: 12.714rem;
		width: 13.929rem;
		padding: 0.857rem;
		box-sizing: border-box;
		text-align: left;
		font-weight: 300;
		display: flex;
		flex-direction: column;
		gap: 1.143rem;
		justify-content: space-between;

		.card-type-text,
		.card-assignee,
		.card-title {
			white-space: nowrap;
			overflow: hidden;
			text-overflow: ellipsis;
		}

		.card-body {
			display: -webkit-box;
			line-clamp: 3;
			-webkit-line-clamp: 3;
			-webkit-box-orient: vertical;
			overflow: hidden;
		}

		.card-type {
			display: flex;
			justify-content: flex-end;
			gap: 0.714rem;

			.card-type-text {
				text-align: right;
				margin-top: auto;
				color: var(--aura-tertiary-50);
			}

			& :global(.aura-icon .icon) {
				background: var(--aura-tertiary-50);
			}
		}

		i {
			font-style: italic;
		}
	}
</style>
