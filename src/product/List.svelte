<script>
  const {data} = $props();
</script>

{#snippet htmlrow(cells)}
  <tr>
  {#each Object.keys(cells) as key}
    <td>{cells[key]}</td>
  {/each}
  </tr>
{/snippet}

{#if data.error}
  {data.error}
{:else}
  <table class={{loading: data.loading}}>
    {#each data.data as row}
      {@render htmlrow(row)}
    {/each}
  </table>
{/if}

<style>
  .loading {
    pointer-events: none;
    text-decoration: line-through;
    user-select: none;
    filter: brightness(70%);
  }
</style>
