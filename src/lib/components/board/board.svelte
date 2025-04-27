<script lang="ts">
	import Panel from '@awenovations/aura/panel.svelte';
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

	let taskFormOpen: boolean = $state(false);
	let taskDetailsOpen: boolean = $state(false);

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
				openTask = _task;
			}, 500);
		} else {
			taskFormOpen = true;
			openTask = _task;
		}
	};

	const handleCreateTask = (taskColumn: string) => {
		taskFormOpen = true;
		newTaskColumn = taskColumn;
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

<Panel open={taskFormOpen} class="task-panel task-form-panel">
	<TaskForm task={openTask} {handleClose} column={newTaskColumn} {handleSubmit} />
</Panel>

<Panel open={taskDetailsOpen} class="task-panel task-details-panel">
	{#if openTask}
		<div class="task-details">
			<h2>{openTask.title}</h2>
			<div class="task-meta">
				<div class="task-meta-type">
					<span>Status</span>
					<span>Assignee</span>
					<span>Task type</span>
				</div>

				<div class="task-meta-value">
					<span>{openTask.column}</span>
					<span>{openTask.assignee}</span>
					<span>{openTask.type}</span>
				</div>
			</div>
			<h4>Description</h4>
			<Container kind="filled" class="task-description">
				{openTask.body}
			</Container>

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
	{/if}
</Panel>

<style lang="ts">
	.column-wrapper {
		display: flex;
		flex-direction: row;
		gap: 2.5rem;
		overflow: hidden;
		height: 100%;
	}

	:global(.task-panel) {
		z-index: 1000;
	}

	:global(.task-details .task-description) {
		white-space: pre-wrap;
		text-align: left !important;
	}

	.task-details {
		white-space: wrap;
		display: flex;
		flex-direction: column;
		width: 41vw;
		padding: 10rem 3.143rem 0;
		box-sizing: border-box;

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
</style>
