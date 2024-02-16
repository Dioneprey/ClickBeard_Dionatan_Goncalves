import { InMemoryUsersRepository } from 'test/repositories/in-memory-users-repository'
import { RegisterBarberUseCase } from './register-barber'
import { InMemoryBarbersRepository } from 'test/repositories/in-memory-barbers-repository'
import { makeUser } from 'test/factories/make-user'
import { UserRole } from '../../enterprise/entities/user'
import { ForbbidenActionError } from './@errors/forbbiden-action-error'

let inMemoryUsersRepository: InMemoryUsersRepository
let inMemoryBarbersRepository: InMemoryBarbersRepository

let sut: RegisterBarberUseCase

describe('Register Barber', () => {
  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository()
    inMemoryBarbersRepository = new InMemoryBarbersRepository()

    sut = new RegisterBarberUseCase(
      inMemoryUsersRepository,
      inMemoryBarbersRepository,
    )
  })

  it('should be able to register a new barber', async () => {
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
        specialities: ['Scissors'],
      },
    })

    expect(result.isRight()).toBeTruthy()
    expect(result.value).toEqual({
      barber: inMemoryBarbersRepository.items[0],
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
})
