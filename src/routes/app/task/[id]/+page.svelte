<script lang="ts">
	import { page } from '$app/stores';
	import { onMount, onDestroy } from 'svelte';
	import { invalidateAll } from '$app/navigation';

	import { showToast } from '@awenovations/aura/toast.store';
	import camelCase from 'lodash.camelcase';

	import Board from '$lib/components/board/board.svelte';

	let {
		handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
			const formData = [...new FormData(event.currentTarget).entries()].reduce(
				(accumulator, value) => ({
					...accumulator,
					[camelCase(value[0])]: value[1]
				}),
				{}
			);

			try {
				const url = formData.id ? `/api/tasks/${formData.id}` : '/api/tasks';

				const response = await fetch(url, {
					method: formData.id ? 'PATCH' : 'POST',
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
		}
	} = $props();

	const clickedOnCard = (el: HTMLElement) => {
		if (el?.classList?.contains('card')) {
			return true;
		}

		if (el?.parentElement && document.body.tagName !== el?.parentElement?.tagName) {
			return clickedOnCard(el?.parentElement);
		}

		return false;
	};

	const mousedown = (evt) => {
		if (clickedOnCard(evt.target)) {
			document.body.classList.add('dragging');
		}
	};

	const mouseup = (evt) => {
		document.body.classList.remove('dragging');
	};
</script>

<svelte:document onmousedown={mousedown} onmouseup={mouseup} />

<Board {handleSubmit} cards={$page.data.cards} openTaskId={$page.data.openTaskId} allProjects={$page.data.allProjects} />

<style lang="scss">
	:global(body.dragging) {
		cursor: grabbing !important;
	}
</style>
