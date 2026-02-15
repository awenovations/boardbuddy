<script lang="ts">
	import Button from '@awenovations/aura/button.svelte';
	import type { Card } from '$lib/components/task-card/types';
	import Dropdown from '@awenovations/aura/dropdown.svelte';
	import TextField from '@awenovations/aura/text-field.svelte';
	import TextEditor from '$lib/components/text-editor/text-editor.svelte';

	interface Props {
		column?: string;
		handleClose: () => void;
		task?: Partial<Card>;
		handleSubmit: (event: FormEvent<HTMLFormElement>) => void;
		projectId?: string;
		cardType?: string;
	}

	let { column = '', handleClose: _handleClose, task = {}, handleSubmit, projectId, cardType = 'task' }: Props = $props();

	let cardTypeValue = $state(task.cardType || cardType);

	const originalColumn = column || task.column || '';
	let selectedColumn = $state(originalColumn);
	let orderValue = $state('');

	const handleClose = () => {
		_handleClose();
		task = {};
	};

	let loading = $state(false);

	let showErrors = $state(null);

	let pristine = $state(true);

	const checkFormValidity = (form: HTMLFormElement) => {
		const valid = form.checkValidity();

		if (!pristine && !valid) {
			showErrors = Array.from(form.elements).reduce((accumulator, element) => {
				const name = element.getAttribute('name');

				if (name) {
					accumulator[name] = !element.checkValidity();
				}

				if (name === 'task-type' || name === 'column') {
					const value = element.getAttribute('value');

					accumulator[name] = !value;
				}

				return accumulator;
			}, {});
		} else {
			showErrors = null;
		}

		return valid;
	};

	const submitForm = async (event: FormEvent<HTMLFormElement>) => {
		event.preventDefault();

		pristine = false;

		if (checkFormValidity(event.target)) {
			try {
				loading = true;
				await handleSubmit(event);
				handleClose();
			} catch (error) {
				console.error(error);
			} finally {
				loading = false;
			}
		}
	};
</script>

<form
	class="task-form"
	onchange={(event) => {
		checkFormValidity(event.currentTarget);
	}}
	onsubmit={submitForm}
	novalidate
>
	<div class="left-column">
		<TextField
			width="100%"
			required
			showErrors={showErrors?.['task-name']}
			name="task-name"
			data-cy="task-name"
			placeholder="Task name..."
			autofocus
			value={task.title}
		>
			{#snippet label()}
				<span>Task name</span>
			{/snippet}
			{#snippet errors()}
				<span data-cy="task-name-errors">Task name is required</span>
			{/snippet}
		</TextField>

		<TextEditor content={task.body} name="description" showErrors={showErrors?.['description']}>
			{#snippet label()}
				<span>Description</span>
			{/snippet}

			{#snippet errors()}
				<span data-cy="task-description-errors">Task description is required</span>
			{/snippet}
		</TextEditor>
	</div>

	<div class="right-column">
		{#if !task._id}
			<div class="right-column-row">
				<Dropdown
					data-cy="card-type"
					fullWidth
					name="card-type-select"
					on:change={(event) => {
						cardTypeValue = event.detail.value;
					}}
					currentValue={cardTypeValue}
				>
					{#snippet label()}
						<span>Card type</span>
					{/snippet}
					<aura-option value="task">Task</aura-option>
					<aura-option value="project">Project</aura-option>
				</Dropdown>
			</div>
		{/if}
		<div class="right-column-row">
			<Dropdown
				data-cy="status"
				fullWidth
				required
				name="column"
				showErrors={showErrors?.['column']}
				on:change={(event) => {
					selectedColumn = event.detail.value;
					orderValue = selectedColumn !== originalColumn ? '-1' : '';
				}}
				currentValue={selectedColumn}
			>
				{#snippet placeholder()}
					<span>select...</span>
				{/snippet}
				{#snippet errors()}
					<span data-cy="status-errors">Status is required</span>
				{/snippet}
				{#snippet label()}
					<span>Status</span>
				{/snippet}
				<aura-option value="Backlog">Backlog</aura-option>
				<aura-option value="To Do">To Do</aura-option>
				<aura-option value="In Progress">In Progress</aura-option>
				<aura-option value="Done">Done</aura-option>
			</Dropdown>
		</div>

		<div class="right-column-row">
			<TextField
				fullWidth
				required
				showErrors={showErrors?.['assignee']}
				name="assignee"
				data-cy="assignee"
				type="text"
				placeholder="Assignee..."
				value={task.assignee}
			>
				{#snippet label()}
					<span>Assignee</span>
				{/snippet}
				{#snippet errors()}
					<span data-cy="assignee-errors">Assignee is required</span>
				{/snippet}
			</TextField>
		</div>

		<div class="right-column-row">
			<Dropdown
				data-cy="task-type"
				fullWidth
				required
				name="task-type"
				showErrors={showErrors?.['task-type']}
				on:change={(event) => {
					task.type = event.detail.value;
				}}
				currentValue={task.type}
			>
				{#snippet placeholder()}
					<span>Work type...</span>
				{/snippet}
				{#snippet errors()}
					<span data-cy="task-type-errors">Work type is required</span>
				{/snippet}
				{#snippet label()}
					<span>Work type</span>
				{/snippet}
				<aura-option value="user story">user story</aura-option>
				<aura-option value="bug fix">bug fix</aura-option>
				<aura-option value="plan">plan</aura-option>
			</Dropdown>
		</div>
		<div class="right-column-row bottom-row">
			<Button
				type="button"
				kind="outlined"
				size="small"
				data-cy="cancel-button"
				on:click={handleClose}>Cancel</Button
			>
			<Button {loading} type="submit" size="small" data-cy="save-button">Save</Button>
		</div>
	</div>
	<input type="hidden" name="order" value={orderValue} />
	<input type="hidden" name="card-type" value={cardTypeValue} />
	{#if projectId}
		<input type="hidden" name="project-id" value={projectId} />
	{/if}
	{#if task._id}
		<input type="hidden" name="id" value={task._id} />
	{/if}
</form>

<style lang="scss">
	.task-form {
		width: 100%;
		height: 100%;
		display: flex;
		flex-direction: row;
		flex: 1;
		gap: 1.571rem;

		.left-column {
			width: 29.786rem;
			display: flex;
			flex-direction: column;
			gap: 1.571rem;

			.description-field {
				flex: 1;
				:global(.aura-text-field-wrapper) {
					height: 100%;
				}
			}
		}

		.right-column {
			display: flex;
			flex-direction: column;
			gap: 1.571rem;
			flex: 1;

			.right-column-row {
				display: flex;
			}

			.bottom-row {
				flex: 1;
				align-items: flex-end;
				justify-content: flex-end;
				gap: 1.571rem;
			}
		}
	}
</style>
