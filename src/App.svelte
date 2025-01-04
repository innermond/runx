<script>
  import {products} from '@/product/api';
  import Products from '@/product/List.svelte';
  import {resource} from '@lib/util.svelte';
  import {signalUserTimeout} from '@lib/api';

  const initial = [{"id":-1,"title":"Placeholder: Title will be here"}];
  const [state, refetch, abortProducts] = resource(products.get, {data: initial}, () => signalUserTimeout(15000));
</script>

<main>
  <h1>Cobai</h1>

  <div class="card">
    <Products data={state} />
    <button disabled={state.loading} onclick={refetch}>Products</button>
    <button disabled={!state.loading} onclick={abortProducts}>Products</button>
  </div>

</main>
