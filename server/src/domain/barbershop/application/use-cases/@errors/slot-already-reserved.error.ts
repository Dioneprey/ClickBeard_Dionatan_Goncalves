import { UseCaseError } from 'src/core/errors/use-case-error'

export class SlotAlreadyReservedError extends Error implements UseCaseError {
  constructor(identifier: string) {
    super(`Hour: ${identifier} already reserved.`)
  }
}
