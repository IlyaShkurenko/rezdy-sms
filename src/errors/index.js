class BadRequestError extends Error {
  constructor(error) {
     const message = error.data && error.data.errors.origin && error.data.errors.origin.errors.join(',') ||
       error.data.errors.destination && error.data.errors.destination.errors.join(',') ||
       error;
    super(message);

    Error.captureStackTrace(this, BadRequestError);

    let proto = Object.getPrototypeOf(this);
    proto.name = 'BadRequestError';
  }
}

module.exports = { BadRequestError }
