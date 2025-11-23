<script lang="ts">
	import Button from '@awenovations/aura/button.svelte';
	import Column from '$lib/components/column/column.svelte';
	import type { Card } from '$lib/components/task-card/types';
	import Container from '@awenovations/aura/container.svelte';
	import TaskForm from '$lib/components/task-form/task-form.svelte';

	interface Props {
		handleSubmit: (event: FormEvent<HTMLFormElement>) => void;
		cards?: Array<Card>;
	}

	let { handleSubmit, cards = [] }: Props = $props();

	let openTask: Partial<Card> = $state({});
	let openEditedTask: Partial<Card> = $state({});

	let taskFormOpen: boolean = $state(false);
	let taskDetailsOpen: boolean = $state(false);

	let showBackdrop = $derived(taskDetailsOpen || taskFormOpen);

	let newTaskColumn = $state('');

	const handleOpenTask = (_task) => {
		if (taskFormOpen) {
			taskFormOpen = false;

			setTimeout(() => {
				taskDetailsOpen = true;
				openTask = _task;
			}, 500);
		} else {
			taskDetailsOpen = true;
			openTask = _task;
		}
	};

	const handleEditTask = (_task) => {
		if (taskDetailsOpen) {
			taskDetailsOpen = false;

			setTimeout(() => {
				taskFormOpen = true;
				openEditedTask = _task;
			}, 500);
		} else {
			taskFormOpen = true;
			openEditedTask = _task;
		}
	};

	const handleCreateTask = (taskColumn: string) => {
		taskFormOpen = true;
		newTaskColumn = taskColumn;
		taskDetailsOpen = false;
		openEditedTask = {};
	};

	const handleClose = () => {
		taskFormOpen = false;
		newTaskColumn = '';
	};

	const tasksByColumns = cards.reduce(
		(accumulator: Record<string, Array<Card>>, currentValue: Card) => {
			const columnName = currentValue.column;
			const tasks = accumulator?.[columnName]
				? [...accumulator[columnName], currentValue]
				: [currentValue];

			return {
				...accumulator,
				[columnName]: [...tasks]
			};
		},
		{}
	);

	const handleEscapeKeydown = (event) => {
		if (event.key === 'Escape') {
			taskFormOpen = false;
			taskDetailsOpen = false;
		}
	};
</script>

<svelte:window onkeydown={handleEscapeKeydown} />

<div class="column-wrapper">
	<Column
		{handleOpenTask}
		{handleEditTask}
		cards={tasksByColumns['Backlog']}
		name="Backlog"
		{handleCreateTask}
	/>
	<Column
		{handleOpenTask}
		{handleEditTask}
		cards={tasksByColumns['To Do']}
		name="To Do"
		{handleCreateTask}
	/>
	<Column
		{handleOpenTask}
		{handleEditTask}
		cards={tasksByColumns['In Progress']}
		name="In Progress"
		{handleCreateTask}
	/>
	<Column
		{handleOpenTask}
		{handleEditTask}
		cards={tasksByColumns['Done']}
		name="Done"
		{handleCreateTask}
	/>
</div>

<div class="task-panel" class:taskFormOpen>
  <h4>New Task</h4>
	<TaskForm task={openEditedTask} {handleClose} column={newTaskColumn} {handleSubmit} />
</div>

<div class="task-details" class:taskDetailsOpen>
	<h3>{openTask.title}</h3>
	<div class="task-meta">
		<div class="task-meta-type">
			<span>Status</span>
			<span>Assignee</span>
			<span>Task type</span>
			<span>Details</span>
		</div>

		<div class="task-meta-value">
			<span>{openTask.column}</span>
			<span>{openTask.assignee}</span>
			<span>{openTask.type}</span>
			<span>{openTask.body}</span>
		</div>
	</div>

	<div class="task-details-actions">
		<Button
			type="button"
			kind="outlined"
			size="small"
			data-cy="cancel-button"
			onclick={() => {
				taskDetailsOpen = false;
			}}>Close</Button
		>
		<Button type="submit" size="small" onclick={() => handleEditTask(openTask)}>Edit</Button>
	</div>
</div>

{#if showBackdrop}
	<div class="backdrop"></div>
{/if}

<style lang="ts">
	.column-wrapper {
		display: flex;
		flex-direction: row;
		gap: 2.5rem;
		overflow: hidden;
		height: 100%;
	}

	:global(.task-panel) {
    min-width: 47.643rem;
    min-height: 29.857rem;
		z-index: 1000;
    display: flex;
    flex-direction: column;
    gap: 1.063rem;
	}

	:global(.task-details .aura-container.task-description) {
		white-space: pre-wrap;
		text-align: left !important;
		flex: 1;
		overflow-y: auto;
		height: auto;
	}

	.task-panel:not(.taskFormOpen),
	.task-details:not(.taskDetailsOpen) {
		display: none;
	}

	.task-details,
	.task-panel {
		z-index: 1001;
		position: absolute;
		width: fit-content;
		padding: 1.571rem;
		background: var(--aura-container-background);
		border-radius: var(--aura-container-border-radius);
		border: 1px solid var(--aura-container-border-color);
		box-shadow: var(--aura-container-drop-shadow);
		transform: translate(-50%, -50%);
		top: 50%;
		left: 50%;
	}

	.task-details {
		white-space: wrap;
		display: flex;
		flex-direction: column;
		max-height: 100%;
		padding: 3.143rem;
		box-sizing: border-box;

		h2,
		.task-meta,
		h4,
		.task-details-actions {
			flex: 0 0 auto;
		}

		&,
		.task-meta .task-meta-value,
		.task-meta .task-meta-type {
			gap: 1.214rem;
		}

		.task-details-actions {
			display: flex;
			gap: 1.071rem;
		}

		.task-meta {
			display: flex;
			gap: 1.786rem;

			.task-meta-type {
				min-width: 4.5rem;
			}

			.task-meta-value,
			.task-meta-type {
				display: flex;
				flex-direction: column;
			}

			.task-meta-value {
				font: var(--aura-default-semibold);
			}
		}
	}

	.backdrop {
		position: absolute;
		top: 0;
		left: 0;
		background: rgba(0, 0, 0, 40%);
		backdrop-filter: blur(0.2rem);
		height: 100%;
		width: 100%;
		z-index: 1000;
	}
</style>
