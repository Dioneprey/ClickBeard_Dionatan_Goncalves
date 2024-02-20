import { UseCaseError } from 'src/core/errors/use-case-error'

interface NoMoreSlotsInDayErrorParams {
  day: Date | string
  slot: string
}

export class NoMoreSlotsInDayError extends Error implements UseCaseError {
  constructor({ day, slot }: NoMoreSlotsInDayErrorParams) {
    super(`No more slots in day, day: ${day}, slot: ${slot}`)
  }
}
