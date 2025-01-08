import {LocalError} from '@error';
import {signalUserTimeout} from '@lib/api';
import {PATIENCE_TIME} from '@/constants';

function resource(fn, zero = {}, signalFnOrTimeout = PATIENCE_TIME) {
  let initial = {data: null, loading: false, error: null};
  initial = Object.assign(initial, zero);
  const state = $state(initial);

  let signalFn = signalUserTimeout;
  if (signalFnOrTimeout instanceof Function) {
    signalFn = signalFnOrTimeout();
  } else if (Number.isInteger(signalFnOrTimeout)) {
    signalFn = _ => signalUserTimeout(signalFnOrTimeout);
  } else if (signalFnOrTimeout === null) {
    signalFn = _ => signalUserTimeout(0);
  }

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

class Slicer {
  #page = 1;
  #offset = 0;
  #limit = 25;
  #direction = +1;
  #peak = null;

  constructor(limit, peak) {
    if (!!limit) this.#limit = limit;
    if (!!peak) {
      if (peak < limit) throw new Error('Slicer: peak is less than limit');
      this.#peak = peak;
    }
  }

  get direction() {
    return this.#direction;
  }

  set direction(v) {
    v = !!v ? 1 : -1;
    this.#direction = v;
  }

  get limit() {
    return this.#limit;
  }

  set limit(v) {
    v = Math.abs(v);
    this.#limit = v;
  }

  next(jump) {
    if (jump) {
      this.#page = jump;
    } else {
      this.#page += this.#direction;
    }

    if (this.#page < 1) {
      this.#page = 1;
      return {done: true};
    }
    
    this.#offset += this.#direction*this.#limit; 
    if (this.#peak && (this.#peak <= this.#offset)) {
      this.#offset = this.#peak;
      return {done: true};
    }
    
    return {
      done: false,
      value: {offset: this.#offset, limit: this.#limit, page: this.#page}
    }
  }
}

export {resource, Slicer,};
