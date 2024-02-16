import { FetchAllSpecialitiesUseCase } from './fetch-all-specialities'
import { InMemorySpecialitiesRepository } from 'test/repositories/in-memory-specialities-repository'
import { makeSpeciality } from 'test/factories/make-speciality'

let inMemorySpecialitiesRepository: InMemorySpecialitiesRepository

let sut: FetchAllSpecialitiesUseCase

describe('Fetch all specialities', () => {
  beforeEach(() => {
    inMemorySpecialitiesRepository = new InMemorySpecialitiesRepository()

    sut = new FetchAllSpecialitiesUseCase(inMemorySpecialitiesRepository)
  })

  it('should be able to fetch all specialities', async () => {
    await Promise.all([
      inMemorySpecialitiesRepository.create(makeSpeciality()),
      inMemorySpecialitiesRepository.create(makeSpeciality()),
      inMemorySpecialitiesRepository.create(makeSpeciality()),
      inMemorySpecialitiesRepository.create(makeSpeciality()),
    ])

    const result = await sut.execute()
    console.log(inMemorySpecialitiesRepository.items)

    expect(result.isRight()).toBeTruthy()
    expect(result.value?.specialities).toHaveLength(4)
  })
})
