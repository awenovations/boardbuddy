<script lang="ts">
	import Panel from '@awenovations/aura/panel.svelte';
	import Column from '$lib/components/column/column.svelte';
	import type { Card } from '$lib/components/task-card/types';
	import TaskForm from '$lib/components/task-form/task-form.svelte';

	export let handleSubmit: (event: FormEvent<HTMLFormElement>) => void;

	export let cards: Array<Card> = [];

	let taskFormOpen: boolean = false;

	$: newTaskColumn = '';

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
	<Column cards={tasksByColumns['Backlog']} name="Backlog" {handleCreateTask} />
	<Column cards={tasksByColumns['To Do']} name="To Do" {handleCreateTask} />
	<Column cards={tasksByColumns['In Progress']} name="In Progress" {handleCreateTask} />
	<Column cards={tasksByColumns['Done']} name="Done" {handleCreateTask} />
</div>

<Panel open={taskFormOpen}>
	<TaskForm {handleClose} column={newTaskColumn} {handleSubmit} />
</Panel>

<style lang="ts">
	.column-wrapper {
		display: flex;
		flex-direction: row;
		gap: 2.5rem;
		overflow: hidden;
	}
</style>
