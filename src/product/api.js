import send, {signalUserTimeout, throwif} from '@lib/api';
import {ApiError} from '@error';

const ENDPOINT = 'https://fakestoreapi.com/products';

async function get(signal = null) {
  const req = new Request(ENDPOINT, signal ? {signal} : undefined);
  try {
    const data = await send(req)
    return data;
  } catch(err) {
    throwif(err, 'getting products list has timedout', 'getting products list has been aborted');
  }
}

const products = {
  get,
}

export {products};
