import { expect } from 'vitest'

import { InMemoryUsersRepository } from 'test/repositories/in-memory-users-repository'
import { makeUser } from 'test/factories/make-user'
import { GetUserProfileUseCase } from './get-user-profile'

let inMemoryUsersRepository: InMemoryUsersRepository
let sut: GetUserProfileUseCase

describe('Get User Profile', () => {
  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository()
    sut = new GetUserProfileUseCase(inMemoryUsersRepository)
  })

  it('should be able to get user profile', async () => {
    const newUser = makeUser({
      email: 'john.doe@email.com',
      password: '123456',
    })

    await inMemoryUsersRepository.create(newUser)

    const result = await sut.execute({
      userId: newUser.id.toString(),
    })

    expect(result.isRight()).toBeTruthy()
    if (result.isLeft()) return
    expect(result.value.userProfile).toEqual(newUser)
  })
})
