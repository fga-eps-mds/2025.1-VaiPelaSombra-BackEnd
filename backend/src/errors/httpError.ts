export class HttpError extends Error {
  constructor(
    public status: number,
    public message: string
  ) {
    super(message);
    this.status = status;
    this.message = message;
    this.name = 'HttpError';
  }
}

export class BadRequestError extends HttpError {
  constructor(message: string = 'Bad Request') {
    super(400, message);
    this.name = 'BadRequestError';
  }
}

export class UnauthorizedError extends HttpError {
  constructor(message: string = 'Unauthorized') {
    super(401, message);
    this.name = 'UnauthorizedError';
  }
}
export class ForbiddenError extends HttpError {
  constructor(message: string = 'Forbidden') {
    super(403, message);
    this.name = 'ForbiddenError';
  }
}

export class NotFoundError extends HttpError {
  constructor(message: string = 'Not Found') {
    super(404, message);
    this.name = 'NotFoundError';
  }
}

export class ConflictError extends HttpError {
  constructor(message: string = 'Conflict') {
    super(409, message);
    this.name = 'ConflictError';
  }
}

export class InternalServerError extends HttpError {
  constructor(message: string = 'Internal Server Error') {
    super(500, message);
    this.name = 'InternalServerError';
  }
}

export class UnprocessableEntityError extends HttpError {
  constructor(message: string = 'Unprocessable Entity') {
    super(422, message);
    this.name = 'UnprocessableEntityError';
  }
}
