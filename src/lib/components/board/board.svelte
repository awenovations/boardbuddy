<script lang="ts">
	import { untrack } from 'svelte';
	import { browser } from '$app/environment';
	import { format, fromUnixTime } from 'date-fns';
	import '$lib/styles/quill-content.css';
	import Button from '@awenovations/aura/button.svelte';
	import TextField from '@awenovations/aura/text-field.svelte';
	import Column from '$lib/components/column/column.svelte';
	import type { Card } from '$lib/components/task-card/types';
	import Container from '@awenovations/aura/container.svelte';
	import TaskForm from '$lib/components/task-form/task-form.svelte';
	import Breadcrumb from '$lib/components/breadcrumb/breadcrumb.svelte';

	interface BreadcrumbItem {
		_id: string;
		title: string;
	}

	interface Props {
		handleSubmit: (event: FormEvent<HTMLFormElement>) => void;
		cards?: Array<Card>;
		openTaskId?: string;
		editTaskId?: string;
		projectId?: string;
		breadcrumb?: Array<BreadcrumbItem>;
		allProjects?: Array<any>;
	}

	let { handleSubmit, cards = [], openTaskId, editTaskId, projectId, breadcrumb, allProjects }: Props = $props();

	const basePath = $derived(projectId ? `/app/project/${projectId}` : '/app');

	let openTask: Partial<Card> = $state({});
	let openEditedTask: Partial<Card> = $state({});

	let taskFormOpen: boolean = $state(false);
	let taskDetailsOpen: boolean = $state(false);

	let showBackdrop = $derived(taskDetailsOpen || taskFormOpen);

	let newTaskColumn = $state('');
	let newCardType = $state('task');
	let filterText = $state('');

	const clearTaskRoute = () => {
		if (browser) {
			history.replaceState({}, '', basePath);
		}
	};

	const handleOpenTask = (_task) => {
		if (taskFormOpen) {
			taskFormOpen = false;

			setTimeout(() => {
				taskDetailsOpen = true;
				openTask = _task;
				if (browser && _task._id) {
					history.pushState({}, '', basePath + '/task/' + _task._id);
				}
			}, 500);
		} else {
			taskDetailsOpen = true;
			openTask = _task;
			if (browser && _task._id) {
				history.pushState({}, '', basePath + '/task/' + _task._id);
			}
		}
	};

	const handleOpenProject = (_card) => {
		if (browser) {
			window.location.href = '/app/project/' + _card._id;
		}
	};

	let hasAutoOpened = false;
	let hasAutoEdited = false;

	$effect(() => {
		if (openTaskId && cards.length && !hasAutoOpened) {
			const card = cards.find((c) => c._id === openTaskId);
			if (card) {
				hasAutoOpened = true;
				const task = {
					_id: card._id,
					title: card.taskName,
					body: card.description,
					assignee: card.assignee,
					createDate: card.createDate,
					type: card.taskType,
					column: card.column,
					cardType: card.cardType
				};
				untrack(() => handleOpenTask(task));
			}
		}
	});

	$effect(() => {
		if (editTaskId && cards.length && !hasAutoEdited) {
			const card = cards.find((c) => c._id === editTaskId);
			if (card) {
				hasAutoEdited = true;
				const task = {
					_id: card._id,
					title: card.taskName,
					body: card.description,
					assignee: card.assignee,
					createDate: card.createDate,
					type: card.taskType,
					column: card.column,
					cardType: card.cardType
				};
				untrack(() => handleEditTask(task));
			}
		}
	});

	const handleEditTask = (_task) => {
		if (taskDetailsOpen) {
			taskDetailsOpen = false;

			setTimeout(() => {
				taskFormOpen = true;
				openEditedTask = _task;
				if (browser && _task._id) {
					history.pushState({}, '', basePath + '/task/' + _task._id + '/edit');
				}
			}, 500);
		} else {
			taskFormOpen = true;
			openEditedTask = _task;
			if (browser && _task._id) {
				history.pushState({}, '', basePath + '/task/' + _task._id + '/edit');
			}
		}
	};

	const handleCreateTask = (taskColumn: string) => {
		clearTaskRoute();
		taskFormOpen = true;
		newTaskColumn = taskColumn;
		newCardType = 'task';
		taskDetailsOpen = false;
		openEditedTask = {};
	};

	const handleCreateProject = () => {
		clearTaskRoute();
		taskFormOpen = true;
		newTaskColumn = 'In Progress';
		newCardType = 'project';
		taskDetailsOpen = false;
		openEditedTask = {};
	};

	const handleClose = () => {
		taskFormOpen = false;
		newTaskColumn = '';
		newCardType = 'task';
		clearTaskRoute();
	};

	let tasksByColumns = $derived(
		cards
			.filter((card) => {
				if (!filterText) return true;
				const query = filterText.toLowerCase();
				return (
					card.taskName?.toLowerCase().includes(query) ||
					card.description?.toLowerCase().includes(query) ||
					card.assignee?.toLowerCase().includes(query) ||
					card.taskType?.toLowerCase().includes(query)
				);
			})
			.reduce((acc: Record<string, Array<Card>>, card: Card) => {
				const col = card.column;
				acc[col] = acc[col] ? [...acc[col], card] : [card];
				return acc;
			}, {})
	);

	const handleEscapeKeydown = (event) => {
		if (event.key === 'Escape') {
			taskFormOpen = false;
			taskDetailsOpen = false;
			clearTaskRoute();
		}
	};
</script>

<svelte:window onkeydown={handleEscapeKeydown} />

<div class="filter-wrapper">
  <Breadcrumb {breadcrumb} {allProjects} onAddProject={handleCreateProject} />
	<TextField
    class="card-filter"
		type="search"
		placeholder="Filter cards"
		bind:value={filterText}
	/>
</div>

<div class="column-wrapper">
	<Column
		{handleOpenTask}
		{handleEditTask}
		{handleOpenProject}
		cards={tasksByColumns['Backlog']}
		name="Backlog"
		{handleCreateTask}
	/>
	<Column
		{handleOpenTask}
		{handleEditTask}
		{handleOpenProject}
		cards={tasksByColumns['To Do']}
		name="To Do"
		{handleCreateTask}
	/>
	<Column
		{handleOpenTask}
		{handleEditTask}
		{handleOpenProject}
		cards={tasksByColumns['In Progress']}
		name="In Progress"
		{handleCreateTask}
	/>
	<Column
		{handleOpenTask}
		{handleEditTask}
		{handleOpenProject}
		cards={tasksByColumns['Done']}
		name="Done"
		{handleCreateTask}
	/>
</div>

{#if taskFormOpen}
	<div class="task-panel">
		<h4>{openEditedTask._id ? 'Edit Task' : 'New Task'}</h4>
		<TaskForm task={openEditedTask} {handleClose} column={newTaskColumn} cardType={newCardType} {handleSubmit} {projectId} />
	</div>
{/if}

<div class="task-details" class:taskDetailsOpen>
	<div class="task-details-header">
		<h3>{openTask.title}</h3>
		<Container clearPadding class="task-meta">
			<div class="task-meta-type">
				<div class="task-meta-item">
					<span class="task-meta-header">Status</span>
					<span class="task-meta-value">{openTask.column}</span>
				</div>
				<div class="task-meta-item">
					<span class="task-meta-header">Work type</span>
					<span class="task-meta-value">{openTask.type}</span>
				</div>
				<div class="task-meta-item">
					<span class="task-meta-header">Assignee</span>
					<span class="task-meta-value">{openTask.assignee}</span>
				</div>
			</div>
		</Container>
	</div>

	<span class="description-header">Description</span>
	<span class="description ql-content">{@html openTask.body}</span>

	<div class="task-details-footer">
		<span class="task-details-time">
			Created {openTask.createDate && format(new Date(openTask.createDate), 'MMMM d, yyyy')}
		</span>
		<div class="task-details-actions">
			<Button
				type="button"
				kind="outlined"
				size="small"
				data-cy="cancel-button"
				onclick={() => {
					taskDetailsOpen = false;
					clearTaskRoute();
				}}>Close</Button
			>
			<Button type="submit" size="small" onclick={() => handleEditTask(openTask)}>Edit</Button>
		</div>
	</div>
</div>

{#if showBackdrop}
	<div class="backdrop"></div>
{/if}

<style lang="ts">
	.filter-wrapper {
		:global(.card-filter) {
			width: 20rem;
		}

		display: flex;
		justify-content: space-between;
		align-items: flex-end;
		margin-bottom: 1rem;
	}

	.column-wrapper {
		display: flex;
		flex-direction: row;
		overflow: hidden;
		height: 100%;
    justify-content: space-between;
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

	.description-header {
		font: var(--aura-default-semibold);
	}

	.description {
		white-space: pre-wrap;
		line-height: 1.5em;
	}

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
		width: 47.643rem;
		max-height: 100%;
		box-sizing: border-box;

		.task-details-header {
			display: flex;
			justify-content: space-between;

			h3 {
				width: 24.286rem;
			}
		}

		.task-details-footer {
			display: flex;
			align-items: self-end;
			justify-content: space-between;
			margin-top: 2rem;

			.task-details-time {
				color: var(--aura-light-tertiary-50);
				font-size: 0.857rem;
			}
		}

		h2,
		:gloabl(.task-meta),
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

		:global(.task-meta) {
			display: flex;
			gap: 1.786rem;
			padding: 0.75rem;

			.task-meta-type {
				min-width: 4.5rem;
				display: flex;
				gap: 2rem;

				.task-meta-item,
				.task-meta-value {
					display: flex;
					flex-direction: column;
				}

				.task-meta-item {
					align-items: baseline;
					gap: 0.5rem;
				}

				.task-meta-value {
					font: var(--aura-default-semibold);
				}
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
