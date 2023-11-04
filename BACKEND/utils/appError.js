
class AppError extends Error {
  constructor(message, statusCode) {
    super(message); // pass argument to Error class, it automatically knows that's a message
    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith('4') ? 'failed' : 'error';
    this.isOperational = true;
    Error.captureStackTrace(this, this.constructor);
  }
}

export default AppError