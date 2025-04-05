<script lang="ts">
	import Panel from '@awenovations/aura/panel.svelte';
	import Column from '$lib/components/column/column.svelte';
	import type { Card } from '$lib/components/task-card/types';
	import TaskForm from '$lib/components/task-form/task-form.svelte';

	interface Props {
		handleSubmit: (event: FormEvent<HTMLFormElement>) => void;
		cards?: Array<Card>;
	}

	let { handleSubmit, cards = [] }: Props = $props();

	let taskForEditing: Partial<Card> = $state({});

	let taskFormOpen: boolean = $state(false);

	let newTaskColumn = $state('');

	const handleEditTask = (task) => {
		taskFormOpen = true;
		taskForEditing = task;
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
</script>

<div class="column-wrapper">
	<Column {handleEditTask} cards={tasksByColumns['Backlog']} name="Backlog" {handleCreateTask} />
	<Column {handleEditTask} cards={tasksByColumns['To Do']} name="To Do" {handleCreateTask} />
	<Column
		{handleEditTask}
		cards={tasksByColumns['In Progress']}
		name="In Progress"
		{handleCreateTask}
	/>
	<Column {handleEditTask} cards={tasksByColumns['Done']} name="Done" {handleCreateTask} />
</div>

<Panel open={taskFormOpen} class="task-form-panel">
	<TaskForm task={taskForEditing} {handleClose} column={newTaskColumn} {handleSubmit} />
</Panel>

<style lang="ts">
	.column-wrapper {
		display: flex;
		flex-direction: row;
		gap: 2.5rem;
		overflow: hidden;
		height: 100%;
	}

	:global(.task-form-panel) {
		z-index: 1000;
	}
</style>
