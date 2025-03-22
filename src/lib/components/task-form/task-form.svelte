<script lang="ts">
	import Button from '@awenovations/aura/button.svelte';
	import type { Card } from '$lib/components/task-card/types';
	import Dropdown from '@awenovations/aura/dropdown.svelte';
	import TextField from '@awenovations/aura/text-field.svelte';

	interface Props {
		column?: string;
		handleClose: () => void;
		task?: Partial<Card>;
		handleSubmit: (event: FormEvent<HTMLFormElement>) => void;
	}

	let { column = '', handleClose: _handleClose, task = {}, handleSubmit }: Props = $props();

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

				if (name === 'task-type') {
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
	<TextField
		required
		showErrors={showErrors?.['task-name']}
		name="task-name"
		data-cy="task-name"
		placeholder="Task name..."
		value={task.title}
	>
		{#snippet label()}
			<span>Task name</span>
		{/snippet}
		{#snippet errors()}
			<span data-cy="task-name-errors">Task name is required</span>
		{/snippet}
	</TextField>

	<TextField
		height="10.786rem"
		required
		showErrors={showErrors?.['description']}
		name="description"
		data-cy="description"
		type="multi"
		placeholder="Descrption..."
		value={task.body}
	>
		{#snippet label()}
			<span>Description</span>
		{/snippet}
		{#snippet errors()}
			<span data-cy="task-description-errors">Task description is required</span>
		{/snippet}
	</TextField>

	<div class="bottom-row">
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

		<Dropdown
			data-cy="task-type"
			fullWidth
			required
			name="task-type"
			showErrors={showErrors?.['task-type']}
			currentValue={task.taskType}
		>
			{#snippet placeholder()}
				<span>Task type...</span>
			{/snippet}
			{#snippet errors()}
				<span data-cy="task-type-errors">Task type is required</span>
			{/snippet}
			{#snippet label()}
				<span>Task type</span>
			{/snippet}
			<aura-option value="user story">user story</aura-option>
			<aura-option value="bug fix">bug fix</aura-option>
			<aura-option value="plan">plan</aura-option>
		</Dropdown>
	</div>
	<div class="bottom-row">
		<Button
			type="button"
			kind="outlined"
			size="small"
			data-cy="cancel-button"
			on:click={handleClose}>Cancel</Button
		>
		<Button {loading} type="submit" size="small" data-cy="save-button">Save</Button>
	</div>
	<input type="hidden" name="column" value={column} />
  {#if task._id}
    <input type="hidden" name="id" value={task._id} />
  {/if}
</form>

<style lang="scss">
	.task-form {
		width: 100%;
		height: 100%;
		display: flex;
		align-items: strech;
		max-width: 27.714rem;
		flex-direction: column;
		justify-content: center;
		margin: 0 auto;

		&,
		& .bottom-row {
			gap: 1rem;
		}

		.bottom-row {
			display: flex;
		}
	}
</style>
