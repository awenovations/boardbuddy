<script lang="ts">
	import { run } from 'svelte/legacy';

	import 'animate.css';
	import '$lib/styles/quill-content.css';

	import Portal from 'svelte-portal';
	import classNames from 'classnames';
	import debounce from 'lodash.debounce';
	import { browser } from '$app/environment';
	import { onMount, onDestroy } from 'svelte';
	import { invalidateAll } from '$app/navigation';
	import Icon from '@awenovations/aura/icon.svelte';
	import Dialog from '@awenovations/aura/dialog.svelte';
	import Button from '@awenovations/aura/button.svelte';
	import { openDialog } from '$lib/stores/dialog.store';
	import Divider from '@awenovations/aura/divider.svelte';
	import { draggingStore } from '$lib/stores/dragging.store';
	import type { Card } from '$lib/components/task-card/types';
	import Container from '@awenovations/aura/container.svelte';
	import { computePosition, autoUpdate } from '@floating-ui/dom';

	interface Props {
		id: string;
		title: string;
		body: string;
		assignee: string;
		column: string;
		type?: string;
		createDate?: number;
		handleEditTask: (task: Card) => void;
		handleOpenTask: (task: Card) => void;
	}

	let {
		id,
		title,
		body,
		assignee,
		column,
		createDate,
		type = 'user story',
		handleEditTask,
		handleOpenTask
	}: Props = $props();

	let hideActionsTransition = $state(false);

	let showActions = $state(false);

	let cardHovered = $state(false);

	let dragging;

	run(() => {
		dragging = $draggingStore.dragging;
	});

	let card: HTMLDivElement = $state();

	let showTitleTooltip = $state(false);

	let cleanUp;
	let cleanUpTooltip;
	const openDeleteDialog = () =>
		openDialog({
			message: 'Are you sure you want to delete this task?',
			confirmText: 'Delete',
			handleConfirm: deleteTask
		});

	let hover = () => {
		hoverOut.cancel();
		if (dragging) {
			draggingStore.set({ ...$draggingStore, hoveredId: id });
		}

		if (!card?.parentElement) return;

		cardHovered = true;

		const cardTitle = card.querySelector('.card-title');

		showTitleTooltip = !dragging && cardTitle.scrollWidth > cardTitle.clientWidth;

		const taskCardActions = document.querySelector(`.task-card-actions[data-id="${id}"]`);

		const setActionPosition = () => {
			if (!card?.parentElement) return;
			const cardColumn = card.parentElement.parentElement;

			computePosition(card.parentElement, taskCardActions, { placement: 'right-start' }).then(
				({ x, y }) => {
					if (cardColumn.offsetTop < y) {
						Object.assign(taskCardActions.style, {
							left: `${x + 8}px`,
							top: `${y}px`
						});
					}
				}
			);
		};

		cleanUp = autoUpdate(card.parentElement, taskCardActions, setActionPosition);

		const taskCardTitleTooltip = document.querySelector(
			`.task-card-title-tooltip[data-id="${id}"]`
		);

		const setTitleTooltipPosition = () => {
			if (!card?.parentElement) return;
			const cardColumn = card.parentElement.parentElement;

			computePosition(card.parentElement, taskCardTitleTooltip, { placement: 'top' }).then(
				({ x, y }) => {
					const topPlacement = y - 8;

					if (cardColumn.offsetTop - taskCardTitleTooltip.clientHeight < topPlacement) {
						Object.assign(taskCardTitleTooltip.style, {
							left: `${x}px`,
							top: `${topPlacement}px`
						});
					}
				}
			);
		};

		cleanUpTooltip = autoUpdate(card.parentElement, taskCardTitleTooltip, setTitleTooltipPosition);

		showActions = !dragging;
	};

	const debounceRate = 300;

	let hoverOut = debounce(() => {
		hoverOut.cancel();
		hideActionsTransition = true;
		hideActions();
		cleanUp?.();
		cleanUpTooltip?.();
		cardHovered = false;
	}, debounceRate);

	const hideActions = debounce(() => {
		if (!cardHovered) {
			showTitleTooltip = false;
			showActions = false;
		} else {
			showActions = !dragging;
		}
		hideActionsTransition = false;
	}, debounceRate);

	const actionsHover = () => {
		hoverOut.cancel();
	};

	const deleteTask = async () => {
		const response = await fetch(`/api/tasks/${id}`, {
			method: 'DELETE'
		});

		if (response.ok) {
			invalidateAll();
		}
	};

	let originalPosition: { x?: number; y?: number } = {};

	const drag = (evt) => {
		const offset = card?.parentElement?.getBoundingClientRect();

		if (card) {
			draggingStore.set({
				...$draggingStore,
				draggedId: id,
				mousePosition: { x: evt.clientX, y: evt.clientY }
			});
			const position = {
				y: offset.y + evt.movementY,
				x: offset.x + evt.movementX
			};

			card.parentElement.classList.add('dragging');
			card.parentElement.style.top = `${position.y}px`;
			card.parentElement.style.left = `${position.x}px`;
		}
	};

	const removeDropStyles = () => {
		card?.parentElement?.classList.remove('dragging');
		card?.parentElement?.style.removeProperty('top');
		card?.parentElement?.style.removeProperty('left');
		card?.parentElement?.classList.remove('animateable');

		document.querySelectorAll('.dropzone').forEach((dropzone) => dropzone.classList.remove('show'));
	};

	const drop = (evt: Event) => {
		if (!card.parentElement) return;

		card.parentElement.classList.add('animateable');

		card.parentElement.style.top = `${originalPosition.y}px`;
		card.parentElement.style.left = `${originalPosition.x}px`;

		document.removeEventListener('mouseup', drop);
		document.removeEventListener('mousemove', drag);

		if ($draggingStore.validDrop) {
			removeDropStyles();
		} else {
			setTimeout(removeDropStyles, 200);
		}

		draggingStore.set({
			dragging: false,
			mousePosition: undefined,
			hoveredId: undefined,
			validDrop: false,
			draggedId: undefined
		});
	};

	const dragStart = () => {
		draggingStore.set({ dragging: true });

		const offset = card.parentElement.getBoundingClientRect();

		originalPosition = {
			y: offset.y,
			x: offset.x
		};

		dragging = true;

		document.addEventListener('mouseup', drop);
		document.addEventListener('mousemove', drag);
	};

	onMount(() => {
		if (browser) {
			card.parentElement.style.setProperty('width', `${card.parentElement.offsetWidth}px`, 'important');

			card.parentElement.addEventListener('mousedown', dragStart);
			card.parentElement.addEventListener('mouseover', hover);
			card.parentElement.addEventListener('mouseleave', hoverOut);

			const taskCardActions = document.querySelector(`.task-card-actions[data-id="${id}"]`);
			taskCardActions.addEventListener('mouseover', actionsHover);
			taskCardActions.addEventListener('mouseleave', hoverOut);
		}
	});

	onDestroy(() => {
		if (browser) {
			card.parentElement.removeEventListener('mousedown', dragStart);
			card.parentElement.removeEventListener('mouseover', hover);
			card.parentElement.removeEventListener('mouseleave', hoverOut);

			const taskCardActions = document.querySelector(`.task-card-actions[data-id="${id}"]`);
			taskCardActions?.removeEventListener('mouseover', actionsHover);
			taskCardActions?.removeEventListener('mouseleave', hoverOut);
		}
	});
</script>

<Container class="task-card" data-cy="task-card" clearPadding variant="elevated" data-id={id}>
	<div bind:this={card} role="button" tabindex="0" class="card" class:dragging>
		<h4 class="card-title" data-cy="task-card-title">{title}</h4>
		<span class="card-body ql-content" data-cy="task-card-body">{@html body}</span>
		<span class="card-assignee" data-cy="task-card-assignee">Assigned to <i>{assignee}</i></span>
		<span class="card-type" data-cy="task-card-type"
			><span class="card-type-text">{type}</span>
			{#if type === 'user story'}
				<Icon name="user-story" />
			{:else if type === 'bug fix'}
				<Icon name="bug" />
			{:else}
				<Icon name="plan" />
			{/if}
		</span>
	</div>
</Container>

<Portal target="body">
	<Container
		data-id={id}
		clearPadding
		variant="flat"
		class={[
			'task-card-title-tooltip',
			'animate__animated',
			'animate__fadeInUp',
			{
				showTitleTooltip,
				animate__fadeOutDown: hideActionsTransition
			}
		]}>{title}</Container
	>
	<Container
		data-id={id}
		variant="elevated"
		class={classNames('task-card-actions', 'animate__animated', 'animate__fadeIn', {
			showActions,
			animate__fadeOut: hideActionsTransition
		})}
		data-cy="task-card-actions"
		clearPadding
	>
		<div
			class="action-button"
			data-cy="task-open-details-button"
			onclick={() =>
				handleOpenTask({
					_id: id,
					title,
					body,
					assignee,
					createDate,
					type,
					column
				})}
		>
			<Icon class="action-button-icon" name="eye-open" />
		</div>
		<Divider class="actions-divider" />
		<div
			class="action-button"
			onclick={() =>
				handleEditTask({
					_id: id,
					title,
					body,
					assignee,
					createDate,
					type
				})}
			data-cy="task-card-edit-button"
		>
			<Icon class="action-button-icon" name="pencil" />
		</div>
		<Divider class="actions-divider" />
		<div class="action-button" data-cy="task-card-delete-button" onclick={openDeleteDialog}>
			<Icon class="action-button-icon" name="trash" />
		</div>
	</Container>
</Portal>

<style lang="scss">
	:global(.aura-container.task-card) {
		width: auto !important;
	}

	:global(.task-card.animateable) {
		transition: all 200ms ease-out;
	}

	:global(.task-card.dragging) {
		position: absolute;
		z-index: 1001;
		opacity: 0.8;
		pointer-events: none;
	}

	:global(.task-card-actions) {
		position: absolute;
		width: 1.714rem !important;
		height: 5.357rem !important;

		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		overflow: hidden;
		cursor: pointer;

		--animate-duration: 250ms;

		&:not(.showActions) {
			display: none;
		}
	}

	:global(.actions-divider) {
		width: 100%;
		max-height: 0.071rem;
	}

	:global(.action-button) {
		flex: 1;
		width: 100%;
		display: flex;
		justify-content: center;
		align-items: center;
		cursor: pointer;

		&:hover {
			background: var(--aura-tertiary-10);
		}
	}

	:global(.action-button-icon .icon) {
		background: var(--aura-tertiary-50) !important;
	}

	:global(.task-card-title-tooltip) {
		position: absolute;
		display: none;
		padding: 0.571rem;
		box-sizing: border-box;
		max-width: 16rem;
		--animate-duration: 100ms;
		text-align: left !important;
	}

	:global(.task-card-title-tooltip.showTitleTooltip) {
		display: block;
	}

  :global(body:not(.dragging) .card:hover) {
    cursor: grab;
  }

	.card {
		height: 12.714rem;
		padding: 0.857rem;
		box-sizing: border-box;
		text-align: left;
		font-weight: 300;
		display: flex;
		flex-direction: column;
		gap: 1.143rem;
		justify-content: space-between;
		user-select: none;
		position: relative;

		* {
			pointer-events: none;
		}

		.card-type-text,
		.card-assignee,
		.card-title {
			white-space: nowrap;
			overflow: hidden;
			text-overflow: ellipsis;
		}

		.card-body {
			display: -webkit-box;
			line-clamp: 3;
			-webkit-line-clamp: 3;
			-webkit-box-orient: vertical;
			overflow: hidden;
			white-space: pre-wrap;
		}

		.card-type {
			display: flex;
			justify-content: flex-end;
			gap: 0.714rem;

			.card-type-text {
				text-align: right;
				margin-top: auto;
				color: var(--aura-tertiary-50);
			}

			& :global(.aura-icon .icon) {
				background: var(--aura-tertiary-50);
			}
		}

		i {
			font-style: italic;
		}
	}
</style>
