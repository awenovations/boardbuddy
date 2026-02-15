<script lang="ts">
	import { untrack } from 'svelte';
	import { page } from '$app/stores';

	interface BreadcrumbItem {
		_id: string;
		title: string;
	}

	interface ProjectDoc {
		_id: string;
		taskName: string;
		project_id?: string | null;
	}

	interface TreeNode {
		_id: string;
		title: string;
		children: TreeNode[];
		expanded: boolean;
	}

	interface Props {
		breadcrumb?: Array<BreadcrumbItem>;
		allProjects?: Array<ProjectDoc>;
		onAddProject?: () => void;
	}

	let { breadcrumb = [], allProjects = [], onAddProject }: Props = $props();

	const maxVisible = 4;
	const shouldCollapse = $derived(breadcrumb.length > maxVisible);
	const tailCount = 3;
	const ellipsisTarget = $derived(shouldCollapse ? breadcrumb[breadcrumb.length - tailCount - 1] : null);
	const visibleCrumbs = $derived(
		shouldCollapse
			? [breadcrumb[0], ...breadcrumb.slice(-tailCount)]
			: breadcrumb
	);

	// Current project ID from breadcrumb (last item)
	const currentProjectId = $derived(breadcrumb.length > 0 ? breadcrumb[breadcrumb.length - 1]._id : null);

	// Build tree from flat project list
	let expandedIds: Set<string> = $state(new Set());

	const projectTree = $derived.by(() => {
		const byParent = new Map<string, ProjectDoc[]>();
		for (const p of allProjects) {
			const parentKey = p.project_id || 'root';
			if (!byParent.has(parentKey)) byParent.set(parentKey, []);
			byParent.get(parentKey)!.push(p);
		}

		function buildNodes(parentId: string): TreeNode[] {
			const children = byParent.get(parentId) || [];
			return children.map((p) => ({
				_id: p._id,
				title: p.taskName,
				children: buildNodes(p._id),
				expanded: expandedIds.has(p._id)
			}));
		}

		return buildNodes('root');
	});

	// Auto-expand ancestors of the current project
	$effect(() => {
		if (breadcrumb.length > 0) {
			const crumbIds = breadcrumb.map((c) => c._id);
			untrack(() => {
				const ids = new Set(expandedIds);
				for (const id of crumbIds) {
					ids.add(id);
				}
				expandedIds = ids;
			});
		}
	});

	let treeOpen = $state(false);
	let toggleButton: HTMLButtonElement;

	function toggleTree() {
		treeOpen = !treeOpen;
	}

	function toggleExpand(id: string, event: MouseEvent) {
		event.preventDefault();
		event.stopPropagation();
		const ids = new Set(expandedIds);
		if (ids.has(id)) {
			ids.delete(id);
		} else {
			ids.add(id);
		}
		expandedIds = ids;
	}

	let titleTooltip: { text: string; top: number; left: number } | null = $state(null);

	function handleCrumbHover(event: MouseEvent, title: string) {
		const el = event.currentTarget as HTMLElement;
		const textEl = el.querySelector('.breadcrumb-link, .breadcrumb-current') as HTMLElement;
		if (textEl && textEl.scrollWidth > textEl.clientWidth) {
			const rect = el.getBoundingClientRect();
			const navRect = el.closest('.breadcrumb')!.getBoundingClientRect();
			titleTooltip = {
				text: title,
				left: rect.left - navRect.left + rect.width / 2,
				top: -8
			};
		} else {
			titleTooltip = null;
		}
	}

	function handleCrumbLeave() {
		titleTooltip = null;
	}

	function handleWindowClick(event: MouseEvent) {
		if (treeOpen && toggleButton && !toggleButton.contains(event.target as Node)) {
			const dropdown = document.querySelector('.tree-dropdown');
			if (dropdown && !dropdown.contains(event.target as Node)) {
				treeOpen = false;
			}
		}
	}
</script>

<svelte:window onclick={handleWindowClick} />

<nav class="breadcrumb">
	<div class="breadcrumb-left">
		<button
			class="tree-toggle"
			bind:this={toggleButton}
			onclick={toggleTree}
			aria-label="Toggle project tree"
			class:tree-open={treeOpen}
		>
			<span class="toggle-caret" class:tree-open={treeOpen}>&rsaquo;</span>
			Projects
		</button>

		<span class="crumb-pill">
			<a href="/app" class="breadcrumb-link">Main</a>
		</span>

		{#each visibleCrumbs as crumb, index}
			<span class="breadcrumb-separator">&rsaquo;</span>
			{#if shouldCollapse && index === 1}
				<span class="crumb-pill">
					<a href="/app/project/{ellipsisTarget?._id}" class="breadcrumb-link breadcrumb-ellipsis">&hellip;</a>
				</span>
				<span class="breadcrumb-separator">&rsaquo;</span>
			{/if}
			{#if index < visibleCrumbs.length - 1}
				<span
					class="crumb-pill"
					onmouseenter={(e) => handleCrumbHover(e, crumb.title)}
					onmouseleave={handleCrumbLeave}
				>
					<a href="/app/project/{crumb._id}" class="breadcrumb-link">{crumb.title}</a>
				</span>
			{:else}
				<span
					class="crumb-pill crumb-current"
					onmouseenter={(e) => handleCrumbHover(e, crumb.title)}
					onmouseleave={handleCrumbLeave}
				>
					<span class="breadcrumb-current">{crumb.title}</span>
				</span>
			{/if}
		{/each}
	</div>

	{#if titleTooltip}
		<div
			class="crumb-title-tooltip"
			style="left: {titleTooltip.left}px; top: {titleTooltip.top}px;"
		>
			{titleTooltip.text}
		</div>
	{/if}

	{#if treeOpen}
		<div class="tree-dropdown">
			<a
				href="/app"
				class="tree-item-row tree-item"
				class:tree-item-active={!currentProjectId && $page.url.pathname === '/app'}
				onclick={() => { treeOpen = false; }}
			>
				Main
			</a>
			{#each projectTree as node}
				{@render treeNode(node, 0)}
			{/each}
			{#if onAddProject}
				<div class="tree-dropdown-divider"></div>
				<button
					class="tree-item-row tree-add-project"
					onclick={() => { treeOpen = false; onAddProject(); }}
				>
					+ New Project
				</button>
			{/if}
		</div>
	{/if}
</nav>

{#snippet treeNode(node: TreeNode, depth: number)}
	<a
		href="/app/project/{node._id}"
		class="tree-item-row"
		class:tree-item-active={currentProjectId === node._id}
		style="padding-left: {depth + 1}rem"
		onclick={() => { treeOpen = false; }}
	>
		{#if node.children.length > 0}
			<button
				class="tree-expand-toggle"
				onclick={(e) => toggleExpand(node._id, e)}
				aria-label="{node.expanded ? 'Collapse' : 'Expand'} {node.title}"
			>
				<span class="tree-caret" class:tree-caret-expanded={node.expanded}>&rsaquo;</span>
			</button>
		{:else}
			<span class="tree-expand-spacer"></span>
		{/if}
		<span class="tree-item-label">{node.title}</span>
	</a>
	{#if node.expanded && node.children.length > 0}
		{#each node.children as child}
			{@render treeNode(child, depth + 1)}
		{/each}
	{/if}
{/snippet}

<style lang="scss">
	.breadcrumb {
		position: relative;
		display: flex;
		align-items: center;
		font: var(--aura-default-regular);

		&, .breadcrumb-link {
			color: var(--aura-tertiary-40);
		}
	}

	.breadcrumb-left {
		display: flex;
		align-items: center;
		gap: 0.5rem;
	}

	.tree-toggle {
		display: flex;
		align-items: center;
		gap: 0.4rem;
		background: var(--aura-tertiary-10);
		border: 1px solid transparent;
		border-radius: var(--aura-form-item-border-radius);
		padding: 0.15rem 0.6rem;
		margin-right: 0.5rem;
		cursor: pointer;
		color: var(--aura-tertiary-40);
		font: var(--aura-default-regular);
		transition: all 0.15s ease;

		&:hover {
			color: var(--aura-highlight);
		}

		&.tree-open {
			color: var(--aura-highlight);
		}
	}

	.toggle-caret {
		display: inline-block;
		transform: rotate(90deg);
		transition: transform 0.15s ease;
		font-size: 1.1em;
		line-height: 1;

		&.tree-open {
			transform: rotate(-90deg);
		}
	}

	.crumb-pill {
		display: inline-flex;
		align-items: center;
		background: var(--aura-tertiary-10);
		border-radius: var(--aura-form-item-border-radius);
		padding: 0.15rem 0.6rem;
		max-width: 6rem;
		transition: background 0.15s ease;

		&:hover:not(.crumb-current) {
			.breadcrumb-link {
				color: var(--aura-highlight);
			}
		}
	}

	.breadcrumb-link,
	.breadcrumb-current {
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	.breadcrumb-link {
		text-decoration: none;
		transition: color 0.15s ease;

		&:hover {
			color: var(--aura-highlight);
		}
	}

	.breadcrumb-separator {
		color: var(--aura-tertiary-40);
		font-size: 1.1em;
		user-select: none;
	}

	.breadcrumb-current {
		font: var(--aura-default-semibold);
	}

	.crumb-current {
		background: var(--aura-tertiary-10);
	}

	.tree-dropdown {
		position: absolute;
		top: 100%;
		left: 0;
		margin-top: 0.35rem;
		min-width: 14rem;
		max-width: 20rem;
		max-height: 20rem;
		overflow-y: auto;
		background: var(--aura-tertiary-10);
		border: 1px solid var(--aura-container-border-color);
		border-radius: var(--aura-menu-border-radius);
		box-shadow: var(--aura-container-drop-shadow);
		z-index: 100;
		padding: 0.35rem 0;
	}

	.tree-item-row {
		display: flex;
		align-items: center;
		padding: 0.35rem 0.75rem;
		text-decoration: none;
		color: var(--aura-font-color);
		cursor: pointer;
		transition: background 0.1s ease;

		&:hover {
			background: var(--aura-tertiary-20);
		}

		&.tree-item-active {
			background: var(--aura-tertiary-20);
			color: var(--aura-highlight);
			font: var(--aura-default-semibold);
		}
	}

	.tree-expand-toggle {
		display: flex;
		align-items: center;
		justify-content: center;
		background: none;
		border: none;
		cursor: pointer;
		padding: 0.15rem 0.3rem;
		color: var(--aura-tertiary-40);
		font-size: 1rem;
		width: 1.2rem;
		flex-shrink: 0;

		&:hover {
			color: var(--aura-highlight);
		}
	}

	.tree-caret {
		display: inline-block;
		transition: transform 0.15s ease;
		font-size: 1.1em;
		line-height: 1;

		&.tree-caret-expanded {
			transform: rotate(90deg);
		}
	}

	.tree-expand-spacer {
		width: 1.2rem;
		flex-shrink: 0;
	}

	.tree-item-label {
		flex: 1;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	.tree-dropdown-divider {
		height: 1px;
		background: var(--aura-tertiary-20);
		margin: 0.35rem 0.5rem;
	}

	.tree-add-project {
		width: 100%;
		background: none;
		border: none;
		font: var(--aura-default-regular);
		color: var(--aura-highlight);
		cursor: pointer;
		text-align: left;
	}

	.crumb-title-tooltip {
		position: absolute;
		transform: translate(-50%, -100%);
		padding: 0.15rem 0.6rem;
		white-space: nowrap;
		z-index: 101;
		background: var(--aura-tertiary-10);
		border-radius: var(--aura-form-item-border-radius);
		font: var(--aura-default-regular);
		color: var(--aura-tertiary-40);
		pointer-events: none;
	}

	.tree-toggle,
	.crumb-pill,
	.crumb-title-tooltip {
		@media (prefers-color-scheme: light) {
			box-shadow: 0 1px 0 0 var(--aura-light-tertiary-20);
		}
		@media (prefers-color-scheme: dark) {
			box-shadow: 0 1px 0 0 black;
		}
	}

	:global([data-theme="light"]) {
		.tree-toggle,
		.crumb-pill,
		.crumb-title-tooltip {
			box-shadow: 0 1px 0 0 var(--aura-light-tertiary-40);
		}
	}

	:global([data-theme="dark"]) {
		.tree-toggle,
		.crumb-pill,
		.crumb-title-tooltip {
			box-shadow: 0 1px 0 0 black;
		}
	}
</style>
