<script lang="ts">
	import { page } from '$app/stores';
	import Landing from '$lib/components/landing/landing.svelte';
</script>

<Landing session={$page.data.session} />
