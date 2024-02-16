import { InMemoryUsersRepository } from 'test/repositories/in-memory-users-repository'
import { RegisterUserUseCase } from './register-user'
import { FakeHasher } from 'test/cryptography/fake-hasher'
import { UserAlreadyExistsError } from './@errors/user-already-exists.error'

let inMemoryUsersRepository: InMemoryUsersRepository
let fakeHasher: FakeHasher

let sut: RegisterUserUseCase

describe('Register User', () => {
  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository()
    fakeHasher = new FakeHasher()

    sut = new RegisterUserUseCase(inMemoryUsersRepository, fakeHasher)
  })

  it('should be able to register a new user', async () => {
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

  it('should hash user password upon registration', async () => {
    const result = await sut.execute({
      name: 'John Doe',
      email: 'john.doe@email.com',
      password: '123456',
    })

    const hashedPassowrd = await fakeHasher.hash('123456')

    expect(result.isRight()).toBeTruthy()
    expect(inMemoryUsersRepository.items[0].password).toEqual(hashedPassowrd)
  })

  it('should not be able to register user with email already used', async () => {
    await sut.execute({
      name: 'John Doe',
      email: 'john.doe@email.com',
      password: '123456',
    })

    const result = await sut.execute({
      name: 'John Doe Second',
      email: 'john.doe@email.com',
      password: '123456',
    })

    expect(result.isLeft()).toBeTruthy()
    expect(result.value).toBeInstanceOf(UserAlreadyExistsError)
  })
})
