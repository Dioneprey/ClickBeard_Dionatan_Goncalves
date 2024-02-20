import { FetchAllSpecialitiesUseCase } from './fetch-all-specialities'
import { InMemorySpecialityRepository } from 'test/repositories/in-memory-specialities-repository'
import { makeSpeciality } from 'test/factories/make-speciality'

let inMemorySpecialityRepository: InMemorySpecialityRepository

let sut: FetchAllSpecialitiesUseCase

describe('Fetch all specialities', () => {
  beforeEach(() => {
    inMemorySpecialityRepository = new InMemorySpecialityRepository()

    sut = new FetchAllSpecialitiesUseCase(inMemorySpecialityRepository)
  })

  it('should be able to fetch all specialities', async () => {
    await Promise.all([
      inMemorySpecialityRepository.create(makeSpeciality()),
      inMemorySpecialityRepository.create(makeSpeciality()),
      inMemorySpecialityRepository.create(makeSpeciality()),
      inMemorySpecialityRepository.create(makeSpeciality()),
    ])

    const result = await sut.execute()

    expect(result.isRight()).toBeTruthy()
    expect(result.value?.specialities).toHaveLength(4)
  })
})
