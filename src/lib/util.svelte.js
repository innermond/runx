import {LocalError} from '@error';

function resource(fn, zero = {}, signalFn = null) {
  let initial = {data: null, loading: false, error: null};
  initial = Object.assign(initial, zero);
  const state = $state(initial);

  let [signal, abort] = signalFn();
  const abortFn = _ => abort();

  const doFn = _ => {
    state.loading = true;
    if (signal.aborted) {
      [signal, abort] = signalFn();
    }
    fn(signal).then(data => {
      state.data = data;
      state.error = null;
    }).catch((err) => {
      if (err instanceof LocalError) {
        state.error = err;
        return;
      }
      throw err;
    }).finally(_ => {
      state.loading = false;
    });
  }

  return [state, doFn, abortFn];
}

export {resource};
