export class AppError extends Error {
  statusCode: number

  constructor(message: string, statusCode: number = 500) {
    super(message)
    this.name = this.constructor.name
    this.statusCode = statusCode
  }
}

export class NotFoundError extends AppError {
  constructor(resource: string, id?: string) {
    super(id ? `${resource} with id ${id} not found` : `${resource} not found`, 404)
  }
}

export class ConflictError extends AppError {
  constructor(message: string) {
    super(message, 409)
  }
}

export class BadRequestError extends AppError {
  constructor(message: string) {
    super(message, 400)
  }
}

export class UnauthorizedError extends AppError {
  constructor(message: string = 'Unauthorized') {
    super(message, 401)
  }
}
