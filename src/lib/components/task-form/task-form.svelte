<script lang="ts">
	import Button from '@awenovations/aura/button.svelte';
	import Dropdown from '@awenovations/aura/dropdown.svelte';
	import TextField from '@awenovations/aura/text-field.svelte';

	export let column: string = '';
	export let handleClose: () => void;
	export let handleSubmit: (event: FormEvent<HTMLFormElement>) => void;

	$: loading = false;

	$: showErrors = null;

	$: pristine = true;

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
	on:change={(event) => {
		checkFormValidity(event.currentTarget);
	}}
	on:submit={submitForm}
	novalidate
>
	<TextField
		required
		showErrors={showErrors?.['task-name']}
		name="task-name"
		data-cy="task-name"
		placeholder="Task name..."
	>
		<span slot="label">Task name</span>
		<span data-cy="task-name-errors" slot="errors">Task name is required</span>
	</TextField>

	<TextField
		height="10.786rem"
		required
		showErrors={showErrors?.['description']}
		name="description"
		data-cy="description"
		type="multi"
		placeholder="Descrption..."
	>
		<span slot="label">Description</span>
		<span data-cy="task-description-errors" slot="errors">Task description is required</span>
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
		>
			<span slot="label">Assignee</span>
			<span data-cy="assignee-errors" slot="errors">Assignee is required</span>
		</TextField>

		<Dropdown
			data-cy="task-type"
			fullWidth
			required
			name="task-type"
			showErrors={showErrors?.['task-type']}
		>
			<span slot="placeholder">Task type...</span>
			<span data-cy="task-type-errors" slot="errors">Task type is required</span>
			<span slot="label">Task type</span>
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
