import { InMemoryUsersRepository } from 'test/repositories/in-memory-users-repository'
import { RegisterBarberUseCase } from './register-barber'
import { InMemoryBarberRepository } from 'test/repositories/in-memory-barbers-repository'
import { makeUser } from 'test/factories/make-user'
import { UserRole } from '../../enterprise/entities/user'
import { ForbbidenActionError } from './@errors/forbbiden-action.error'
import { InMemorySpecialityRepository } from 'test/repositories/in-memory-specialities-repository'
import { makeSpeciality } from 'test/factories/make-speciality'
import { ResourceNotFoundError } from './@errors/resource-not-found.error'

let inMemoryUsersRepository: InMemoryUsersRepository
let inMemoryBarberRepository: InMemoryBarberRepository
let inMemorySpecialityRepository: InMemorySpecialityRepository

let sut: RegisterBarberUseCase

describe('Register Barber', () => {
  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository()
    inMemoryBarberRepository = new InMemoryBarberRepository()
    inMemorySpecialityRepository = new InMemorySpecialityRepository()

    sut = new RegisterBarberUseCase(
      inMemoryUsersRepository,
      inMemoryBarberRepository,
      inMemorySpecialityRepository,
    )
  })

  it('should be able to register a new barber', async () => {
    const user = makeUser({
      role: UserRole.ADMIN,
    })
    const speciality = makeSpeciality({
      name: 'Scissors',
    })

    await inMemoryUsersRepository.create(user)
    await inMemorySpecialityRepository.create(speciality)

    const result = await sut.execute({
      userId: user.id.toString(),
      barberData: {
        name: 'John doe',
        birthDate: new Date(1995, 11, 17),
        hiringDate: new Date(),
        specialities: [speciality.id.toString()],
      },
    })

    expect(result.isRight()).toBeTruthy()
    expect(result.value).toEqual({
      barber: inMemoryBarberRepository.items[0],
    })
  })

  it('should not be able to register a new barber as a client user', async () => {
    const user = makeUser({
      role: UserRole.CLIENT,
    })

    await inMemoryUsersRepository.create(user)

    const result = await sut.execute({
      userId: user.id.toString(),
      barberData: {
        name: 'John doe',
        birthDate: new Date(1995, 11, 17),
        hiringDate: new Date(),
        specialities: ['Scissors'],
      },
    })

    expect(result.isLeft()).toBeTruthy()
    expect(result.value).toBeInstanceOf(ForbbidenActionError)
  })

  it('should not be able to register a new barber with invalid speciality', async () => {
    const user = makeUser({
      role: UserRole.ADMIN,
    })

    await inMemoryUsersRepository.create(user)

    const result = await sut.execute({
      userId: user.id.toString(),
      barberData: {
        name: 'John doe',
        birthDate: new Date(1995, 11, 17),
        hiringDate: new Date(),
        specialities: ['invalid-id'],
      },
    })

    expect(result.isLeft()).toBeTruthy()

    expect(result.value).toBeInstanceOf(ResourceNotFoundError)
  })
})
