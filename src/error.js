class LocalError extends Error {
  constructor(message) {
    super(message)
    this.name = this.constructor.name;
  }
}

// TODO sync with the way remote api returns error
class ApiError extends Error {
  #res = null;

  static userMessage = 'remote failure';

  static newWithResponse(res, text = null, err = null) {
    return new ApiError(text ?? ApiError.userMessage, err ?? undefined, res);
  }

  constructor(userMessage = ApiError.userMessage, err = null, res = null,) {
    super(userMessage);
    this.name = this.constructor.name;

    this.messages = new Set();
    this.errors = new Set();

    this.messages.add(userMessage);
    if (err instanceof Error) this.errors.add(err)
    
    if (res) this.#res = res;
  }

  message(txt) {
    if (!!txt) {
      this.messages.add(txt);
      return;
    }

    return this.messages.join(', ');
  }
}

export {LocalError, ApiError};
