export abstract class RequestError extends Error {
  name = "RequestError"
}
export class UnAuthorizedError extends RequestError {
  name = "UnAuthorizedError"

  constructor(message?: string) {
    super(message)
  }
}

export class UnprocessableEntityError extends RequestError {
  name = "UnprocessableEntityError"

  constructor(message?: string) {
    super(message)
  }
}
