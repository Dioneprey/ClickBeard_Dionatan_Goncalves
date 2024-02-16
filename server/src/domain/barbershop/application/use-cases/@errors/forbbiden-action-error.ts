import { UseCaseError } from 'src/core/errors/use-case-error'

export class ForbbidenActionError extends Error implements UseCaseError {
  constructor() {
    super('Forbbiden action.')
  }
}
