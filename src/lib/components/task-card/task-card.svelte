<script lang="ts">
	import { browser } from '$app/environment';
	import { onMount, onDestroy } from 'svelte';
	import Icon from '@awenovations/aura/icon.svelte';
	import { draggingStore } from '$lib/stores/dragging.store';
	import Container from '@awenovations/aura/container.svelte';

	export let id: string;
	export let title: string;
	export let body: string;
	export let assignee: string;
	export let type = 'user story';

	$: dragging = $draggingStore.dragging;

	let card: HTMLDivElement;

	let hover = () => {
		if (dragging) {
			draggingStore.set({ ...$draggingStore, hoveredId: id });
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

		card.parentElement.classList.add('animateable');

		card.parentElement.style.top = `${originalPosition.y}px`;
		card.parentElement.style.left = `${originalPosition.x}px`;

		document.removeEventListener('mouseup', drop);
		document.removeEventListener('mousemove', drag);

    if($draggingStore.validDrop) {
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
			card.parentElement.addEventListener('mousedown', dragStart);
			card.parentElement.addEventListener('mouseover', hover);
		}
	});

	onDestroy(() => {
		if (browser) {
			card.parentElement.removeEventListener('mousedown', dragStart);
			card.parentElement.removeEventListener('mouseover', hover);
		}
	});
</script>

<Container class="task-card" data-cy="task-card" clearPadding variant="elevated" data-id={id}>
	<div bind:this={card} role="button" tabindex="0" class="card" class:dragging>
		<h4 class="card-title" data-cy="task-card-title">{title}</h4>
		<span class="card-body" data-cy="task-card-body">{body}</span>
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

<style lang="scss">
	:global(.task-card.animateable) {
		transition: all 200ms ease-out;
	}

	:global(.task-card.dragging) {
		position: absolute;
		z-index: 1001;
		opacity: 0.8;
		pointer-events: none;
	}

	.card {
		height: 12.714rem;
		width: 13.929rem;
		padding: 0.857rem;
		box-sizing: border-box;
		text-align: left;
		font-weight: 300;
		display: flex;
		flex-direction: column;
		gap: 1.143rem;
		justify-content: space-between;
		user-select: none;

		&.dragging {
			cursor: grabbing !important;
		}

		&:hover {
			cursor: grab;
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
