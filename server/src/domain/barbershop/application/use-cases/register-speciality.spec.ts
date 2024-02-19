import { InMemoryUsersRepository } from 'test/repositories/in-memory-users-repository'
import { RegisterSpecialityUseCase } from './register-speciality'
import { makeUser } from 'test/factories/make-user'
import { UserRole } from '../../enterprise/entities/user'
import { InMemorySpecialityRepository } from 'test/repositories/in-memory-specialities-repository'

let inMemoryUsersRepository: InMemoryUsersRepository
let inMemorySpecialityRepository: InMemorySpecialityRepository

let sut: RegisterSpecialityUseCase

describe('Register Speciality', () => {
  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository()
    inMemorySpecialityRepository = new InMemorySpecialityRepository()

    sut = new RegisterSpecialityUseCase(
      inMemoryUsersRepository,
      inMemorySpecialityRepository,
    )
  })

  it('should be able to register a new speciality', async () => {
    const user = makeUser({
      role: UserRole.ADMIN,
    })

    await inMemoryUsersRepository.create(user)

    const result = await sut.execute({
      userId: user.id.toString(),
      specialityData: {
        name: 'Scissors',
      },
    })

    expect(result.isRight()).toBeTruthy()
    expect(result.value).toEqual({
      speciality: inMemorySpecialityRepository.items[0],
    })
  })
})
