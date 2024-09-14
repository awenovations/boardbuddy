<script lang="ts">
	import Column from '$lib/components/column/column.svelte';
	import TaskForm from '$lib/components/task-form/task-form.svelte';
	import Panel from '@awenovations/aura/panel.svelte';

  export let handleSubmit : (event: FormEvent<HTMLFormElement>) => void;

	let taskFormOpen: boolean = false;
	$: newTaskType = '';

	const handleCreateTask = (taskType: string) => {
		taskFormOpen = true;
    newTaskType = taskType;
	};

	const handleClose = () => {
		taskFormOpen = false;
    newTaskType = "";
	};

</script>

<div class="column-wrapper">
	<Column name="Backlog" {handleCreateTask} />
	<Column name="To Do" {handleCreateTask} />
	<Column name="In Progress" {handleCreateTask} />
	<Column name="Done" {handleCreateTask} />
</div>

<Panel open={taskFormOpen}>
  <TaskForm {handleClose} type={newTaskType} {handleSubmit} />
</Panel>

<style lang="ts">
	.column-wrapper {
		display: flex;
		flex-direction: row;
		gap: 2.5rem;
		height: 100%;
		width: 100%;
	}
</style>
