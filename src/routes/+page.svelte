<script lang="ts">
	import { page } from '$app/stores';
	import { invalidateAll } from '$app/navigation';

	import { showToast } from '@awenovations/aura/toast.store';
	import camelCase from 'lodash.camelCase';

	import Board from '$lib/components/board/board.svelte';

	$: cards = $page.data.cards;

	export let handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
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
				body: JSON.stringify(formData)
			});

			if (response.ok) {
				showToast({
					severity: 'success',
					message: 'Task created!'
				});
				invalidateAll();
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
	};
</script>

{#key cards}
	<Board {handleSubmit} cards={$page.data.cards} />
{/key}
