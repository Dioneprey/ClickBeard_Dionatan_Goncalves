import { UseCaseError } from 'src/core/errors/use-case-error'

export class ResourceNotFoundError extends Error implements UseCaseError {
  constructor(identifier: string) {
    super(`Resource not found. Details: ${identifier}`)
  }
}
