<script lang="ts">
	import { run } from 'svelte/legacy';

	import 'animate.css';

	import { browser } from '$app/environment';
	import { invalidateAll } from '$app/navigation';
	import Link from '@awenovations/aura/link.svelte';
	import Icon from '@awenovations/aura/icon.svelte';
	import Tooltip from '@awenovations/aura/tooltip.svelte';
	import { draggingStore } from '$lib/stores/dragging.store';
	import Container from '@awenovations/aura/container.svelte';
	import type { Card } from '$lib/components/task-card/types';
	import TaskCard from '$lib/components/task-card/task-card.svelte';

	interface Props {
		name: string;
		cards?: Array<Card>;
		handleCreateTask: (type: string) => void;
		handleEditTask: (task: Card) => void;
		handleOpenTask: (task: Card) => void;
	}

	let { name, cards = [], handleCreateTask, handleEditTask, handleOpenTask }: Props = $props();

	let columnWrapper: HTMLDivElement = $state();
	let droppable = $state(false);

	let dragging = $derived($draggingStore.dragging);
	let draggedId = $derived($draggingStore.draggedId);

	let hoveredId = $derived($draggingStore.hoveredId);

	let cardList = $derived([
		{ dropzone: true, visible: false, index: 0 },
		...cards.flatMap((card, index) => [card, { dropzone: true, index: index + 1 }])
	]);

	run(() => {
		if (!dragging) {
			droppable = false;
		}
	});

	const handleCreateTaskElement = () => {
		handleCreateTask(name);
	};

	const isIntersecting = (el1, rect2) => {
		const rect1 = el1.getBoundingClientRect();

		const isIntersecting =
			rect1.left < rect2.right &&
			rect1.right > rect2.left &&
			rect1.top < rect2.bottom &&
			rect1.bottom > rect2.top;

		return isIntersecting;
	};

	const scrollDown = () => {
		const draggedBox = document.querySelector(`[data-id="${draggedId}"]`);

		const cardContainer = columnWrapper.querySelector('.card-container');

		if (cardContainer.scrollTop !== cardContainer.scrollHeight) {
			const draggedBoxBottom = draggedBox.getBoundingClientRect().bottom;
			const columnBottom = cardContainer.getBoundingClientRect().bottom;
			const scrollDownZone = columnBottom - draggedBoxBottom;

			if (scrollDownZone <= 40) {
				cardContainer.scrollTop = cardContainer.scrollTop + 5;
			}
		}
	};

	const scrollUp = () => {
		const draggedBox = document.querySelector(`[data-id="${draggedId}"]`);

		const cardContainer = columnWrapper.querySelector('.card-container');

		if (cardContainer.scrollTop !== 0) {
			const draggedBoxTop = draggedBox.getBoundingClientRect().top;
			const columnTop = cardContainer.getBoundingClientRect().top;
			const scrollUpZone = draggedBoxTop - columnTop;

			if (scrollUpZone <= 40) {
				cardContainer.scrollTop = cardContainer.scrollTop - 5;
			}

			return true;
		}

		return false;
	};

	const showFirstDropzone = () => {
		const draggedBox = document.querySelector(`[data-id="${draggedId}"]`);

		const cardContainerBox = columnWrapper
			?.querySelector('.card-container')
			?.getBoundingClientRect();

		if (
			draggedBox &&
			cardContainerBox &&
			isIntersecting(draggedBox, {
				right: cardContainerBox.right,
				left: cardContainerBox.left,
				top: cardContainerBox.top,
				bottom: cardContainerBox.top + 40
			})
		) {
			showDropzone('.dropzone:first-of-type');

			return true;
		}

		return false;
	};

	const calculateIntersectionArea = (el1, el2) => {
		const rect1 = el1.getBoundingClientRect();
		const rect2 = el2.getBoundingClientRect();

		if (
			rect1.right < rect2.left ||
			rect1.left > rect2.right ||
			rect1.bottom < rect2.top ||
			rect1.top > rect2.bottom
		) {
			return 0;
		}

		const xOverlap = Math.max(
			0,
			Math.min(rect1.right, rect2.right) - Math.max(rect1.left, rect2.left)
		);
		const yOverlap = Math.max(
			0,
			Math.min(rect1.bottom, rect2.bottom) - Math.max(rect1.top, rect2.top)
		);
		const overlapArea = xOverlap * yOverlap;

		return overlapArea;
	};

	const findLargestIntersection = () => {
		const draggedElement = document.querySelector(`[data-id="${draggedId}"]`);

		return Array.from(columnWrapper.querySelectorAll('.task-card, .dropzone'))
			.filter(
				(element) =>
					draggedElement !== element &&
					isIntersecting(draggedElement, element.getBoundingClientRect())
			)
			.map((element) => [element, calculateIntersectionArea(draggedElement, element)])
			.sort(([elA, intersectionA], [elB, intersectionB]) => intersectionB - intersectionA)
			.map(([element]) => element);
	};

	const showOrderedDropzones = () => {
		const largestIntersection = findLargestIntersection()[0];

		if (largestIntersection) {
			if (largestIntersection.classList.contains('dropzone')) return true;

			const intersectionBox = largestIntersection.getBoundingClientRect();

			const selector = `[data-id="${hoveredId}"]`;
			const draggedBox = document.querySelector(`[data-id="${draggedId}"]`).getBoundingClientRect();

			const halfWayPoint = intersectionBox.bottom - intersectionBox.top;
			const draggedHalfWayPoint = draggedBox.bottom - draggedBox.top;

			let placementSelector: string;

			if (halfWayPoint < draggedHalfWayPoint) {
				placementSelector = `${selector} + .dropzone`;
			} else {
				placementSelector = `.dropzone:has(+ ${selector})`;
			}

			showDropzone(placementSelector);

			return true;
		}

		return false;
	};

	const hideDropzones = () => {
		document
			.querySelectorAll('.dropzone.show')
			.forEach((dropzone) => dropzone.classList.remove('show'));
	};

	const showDropzone = (selector: string) => {
		const dropzone = columnWrapper.querySelector(selector);

		if (!dropzone?.classList.contains('show')) {
			hideDropzones();

			dropzone?.classList.add('show');
		}
	};

	const showLastDropzone = () => showDropzone('.dropzone:last-of-type');

	const mousemove = () => {
		if (draggedId) {
			scrollUp();
			scrollDown();

			if (showFirstDropzone()) return;

			if (showOrderedDropzones()) return;

			showLastDropzone();
		}
	};

	const mouseover = () => {
		droppable = dragging;
	};

	const mouseout = () => {
		droppable = false;
		hideDropzones();
	};

	const mouseup = async (evt) => {
		let index = columnWrapper.querySelector('.dropzone.show')?.getAttribute('data-index');

		if (typeof index !== 'undefined') {
			const draggedCard = document.querySelector(`[data-id="${draggedId}"]`);

			draggingStore.set({
				...$draggingStore,
				validDrop: true
			});

			if (index > 0) index--;

			columnWrapper.querySelector('.dropzone.show').after(draggedCard);

			const tasks = Array.from(columnWrapper.querySelectorAll('.task-card')).map((card, index) => ({
				column: name,
				_id: card.getAttribute('data-id'),
				order: index
			}));

			const response = await fetch('/api/tasks', {
				method: 'PATCH',
				body: JSON.stringify(tasks)
			});

			if (response.ok) {
				invalidateAll();
			}
		}
	};
</script>

<div
	bind:this={columnWrapper}
	data-cy="column"
	class="column-wrapper"
	class:droppable
	onmouseover={mouseover}
	onmouseout={mouseout}
	onmousemove={mousemove}
	onmouseup={mouseup}
>
	<h2 data-cy="column-header">
		{name}
		<span class="create-button">
			<Tooltip placement="top-start" content="Click to add a card">
				<Link onclick={handleCreateTaskElement} data-cy="add-button"
					><Icon class="bg" name="circle-plus" /></Link
				>
			</Tooltip>
		</span>
	</h2>
	<Container kind="outlined" clearPadding class="card-container" data-cy="card-container">
		{#each cardList as card}
			{#key card}
				{#if card.dropzone}
					<div class="dropzone" data-index={card.index}>Drop Here</div>
				{:else}
					<TaskCard
						id={card._id}
						title={card.taskName}
						body={card.description}
						type={card.taskType}
						assignee={card.assignee}
						column={card.column}
						{handleEditTask}
						{handleOpenTask}
					/>
				{/if}
			{/key}
		{/each}
	</Container>
</div>

<style lang="scss">
	.column-wrapper {
		width: 15.643rem;
		display: flex;
		flex-direction: column;
		align-items: stretch;

		:global(.card-container) {
			flex: 1;
			width: auto;
			padding: 0.786rem;
			display: flex;
			flex-direction: column;
			gap: 0.875rem;
			overflow-y: scroll;
			padding-bottom: 14.286rem;
		}

		:global(.dropzone.show) {
			display: flex;
		}

		:global(.dropzone) {
			display: none;

			pointer-events: none;
			border-radius: 0.714rem;
			border: 0.143rem dashed var(--aura-container-border-color);
			min-height: 12.714rem;
			width: 13.929rem;
			flex-direction: column;
			justify-content: center;
			font: var(--aura-h4);
			font-style: italic;
			color: var(--aura-tertiary-40);
		}

		&.droppable {
			:global(.card-container) {
				border-color: var(--aura-informational-10);
				box-shadow: 0px 0px 8px 0px var(--aura-informational-10) inset;
			}
		}

		h2 {
			margin-bottom: -0.5rem;
			z-index: 0;
			display: flex;
			align-items: center;
			justify-content: center;
			gap: 0.5rem;
		}

		.create-button {
			font: var(--aura-default-regular);

			& :global(.aura-icon .icon) {
				background: var(--aura-tertiary-30);
			}
		}
	}
</style>
