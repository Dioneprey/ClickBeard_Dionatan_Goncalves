import { InMemoryUsersRepository } from 'test/repositories/in-memory-users-repository'
import { FakeHasher } from 'test/cryptography/fake-hasher'
import { UserAlreadyExistsError } from './@errors/user-already-exists.error'
import { RegisterBarberUseCase } from './register-barber'
import { InMemoryBarbersRepository } from 'test/repositories/in-memory-barbers-repository'

let inMemoryUsersRepository: InMemoryUsersRepository
let inMemoryBarbersRepository: InMemoryBarbersRepository
let fakeHasher: FakeHasher

let sut: RegisterBarberUseCase

describe('Register Barber', () => {
  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository()
    inMemoryBarbersRepository = new InMemoryBarbersRepository()
    fakeHasher = new FakeHasher()

    sut = new RegisterBarberUseCase(
      inMemoryUsersRepository,
      inMemoryBarbersRepository,
    )
  })

  it('should be able to register a new barber', async () => {
    const result = await sut.execute({
      name: 'John Doe',
      email: 'john.doe@email.com',
      password: '123456',
    })

    expect(result.isRight()).toBeTruthy()
    expect(result.value).toEqual({
      user: inMemoryUsersRepository.items[0],
    })
  })
})
