<script lang="ts">
	let { data, children } = $props();
</script>

<div class="wrapper">
	{@render children?.()}
</div>

<style>
	.wrapper {
		display: flex;
    justify-content: center;
    flex-direction: column;
		height: 100%;
  }
</style>
