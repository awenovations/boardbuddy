<script lang="ts">
	import Container from '@awenovations/aura/container.svelte';

  export let title: string;
  export let body: string;
  export let assignee: string;
  export let type = "user story";

</script>

<Container data-cy="task-card" clearPadding variant="elevated">
  <div class="card">
    <h4 class="card-title" data-cy="task-card-title">{title}</h4>
    <span class="card-body" data-cy="task-card-body">{body}</span>
    <span class="card-assignee" data-cy="task-card-assignee">Assigned to <i>{assignee}</i></span>
    <span class="card-type" data-cy="task-card-type">{type}</span>
  </div>
</Container>

<style lang="scss">
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

    .card-type,
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
      text-align: right;
      margin-top: auto;
      color: var(--aura-tertiary-50);
    }

    i {
      font-style: italic;
    }
  }
</style>
