<script lang="ts">
	import { showToast } from '@awenovations/aura/toast.store';
  import camelCase from 'lodash.camelCase';

	import Board from '$lib/components/board/board.svelte';

	export let handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
		console.log(event);
		const formData = [...new FormData(event.currentTarget).entries()].reduce(
			(accumulator, value) => ({
				...accumulator,
				[camelCase(value[0])]: value[1]
			}),
			{}
		);

		try {
			const response = await fetch('/api/tasks/add', {
				method: 'POST',
				body: JSON.stringify(formData),
			});

			if (response.ok) {
				showToast({
					severity: 'success',
					message: 'Task created!'
				});
				return;
			} else {
				throw Error((await response.json()).message);
			}
		} catch (error) {
			const errorMessage = (error as { message: string }).message;

			showToast({
				severity: 'error',
				message: (error as { message: string }).message
			});

			throw new Error(errorMessage);
		}

		console.log('formData', formData);
	};
</script>

<Board {handleSubmit} />
