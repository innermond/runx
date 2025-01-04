import {ApiError} from  '@error';

const signalUserTimeout = (after = 0) => {
  const userAbort = new AbortController();
  const timeoutSignal = AbortSignal.timeout(after);

  const signal = after > 0 ? AbortSignal.any([userAbort.signal, timeoutSignal]) : userAbort.signal;
  const abort = userAbort.abort.bind(userAbort);
  
  return [signal, abort];
};

const throwif = (err, timeoutText = 'request has timed out', abortText = 'request has been aborted') => {
  if (err.name === 'TimeoutError') {
    throw new ApiError(timeoutText, err);
  }
  if (err.name === 'AbortError') {
    throw new ApiError(abortText, err);
  }
    throw err;
};

const [signalDefault] = signalUserTimeout(1000);

const send = async (req) => {
  if (!req.headers.has('Content-type')) {
    req.headers.set('Content-Type', 'application/json');
  }
  if (!req?.signal) req.signal = signalDefault;
  
  const res = await fetch(req);
  if (!res.ok) throw ApiError.newWithResponse(res);
  
  const data = await res.json();
  return data;
};

export default send;
export {signalUserTimeout, throwif};
