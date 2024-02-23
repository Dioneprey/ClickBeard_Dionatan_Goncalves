import { UseCaseError } from 'src/core/errors/use-case-error'

export class ImageCouldNotBeSentError extends Error implements UseCaseError {
  constructor() {
    super('The image could not be sent.')
  }
}
