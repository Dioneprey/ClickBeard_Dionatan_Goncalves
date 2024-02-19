import { makeBarber } from 'test/factories/make-barber'
import { FetchBarbersUseCase } from './fetch-barbers'
import { InMemoryBarberRepository } from 'test/repositories/in-memory-barbers-repository'
let inMemoryBarberRepository: InMemoryBarberRepository

let sut: FetchBarbersUseCase

describe('Fetch barbers', () => {
  beforeEach(() => {
    inMemoryBarberRepository = new InMemoryBarberRepository()

    sut = new FetchBarbersUseCase(inMemoryBarberRepository)
  })

  it('should be able to fetch barbers', async () => {
    makeBarber()

    await Promise.all([
      inMemoryBarberRepository.create(makeBarber()),
      inMemoryBarberRepository.create(makeBarber()),
      inMemoryBarberRepository.create(makeBarber()),
    ])

    const result = await sut.execute()

    expect(result.isRight).toBeTruthy()
    expect(result.value?.barbers).toHaveLength(3)
  })
})
