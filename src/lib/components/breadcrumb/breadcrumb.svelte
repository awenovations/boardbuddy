<script lang="ts">
	interface BreadcrumbItem {
		_id: string;
		title: string;
	}

	interface Props {
		breadcrumb?: Array<BreadcrumbItem>;
	}

	let { breadcrumb = [] }: Props = $props();

	const maxVisible = 5;
	const shouldCollapse = $derived(breadcrumb.length > maxVisible);
	// When collapsing: show first crumb, ellipsis linking to parent of the last 3, then last 3 crumbs
	const tailCount = 3;
	const ellipsisTarget = $derived(shouldCollapse ? breadcrumb[breadcrumb.length - tailCount - 1] : null);
	const visibleCrumbs = $derived(
		shouldCollapse
			? [breadcrumb[0], ...breadcrumb.slice(-tailCount)]
			: breadcrumb
	);
</script>

<nav class="breadcrumb">
	Projects: <a href="/app" class="breadcrumb-link">Main</a>
	{#each visibleCrumbs as crumb, index}
		<span class="breadcrumb-separator">&gt;</span>
		{#if shouldCollapse && index === 1}
			<a href="/app/project/{ellipsisTarget._id}" class="breadcrumb-link breadcrumb-ellipsis">&hellip;</a>
			<span class="breadcrumb-separator">&gt;</span>
		{/if}
		{#if index < visibleCrumbs.length - 1}
			<a href="/app/project/{crumb._id}" class="breadcrumb-link">{crumb.title}</a>
		{:else}
			<span class="breadcrumb-current">{crumb.title}</span>
		{/if}
	{/each}
</nav>

<style lang="scss">
	.breadcrumb {
		display: flex;
		align-items: center;
		gap: 0.5rem;
    font: var(--aura-default-regular);

    &, .breadcrumb-link {
      color: var(--aura-light-tertiary-30);
    }
	}

	.breadcrumb-link {
		text-decoration: none;

		&:hover {
			text-decoration: underline;
		}
	}

	.breadcrumb-current {
    font: var(--aura-default-semibold);
	}
</style>
