import { UseCaseError } from 'src/core/errors/use-case-error'

export class InvalidAppointmentSlotError extends Error implements UseCaseError {
  constructor(identifier: string) {
    super(`Hour: ${identifier} is not valid.`)
  }
}
