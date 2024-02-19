import { Either, left, right } from 'src/core/either'
import { UserRole } from '../../enterprise/entities/user'
import { Injectable } from '@nestjs/common'
import { UsersRepository } from '../repositories/users-repository'
import { ForbbidenActionError } from './@errors/forbbiden-action.error'
import { Speciality } from '../../enterprise/entities/speciality'
import { SpecialityRepository } from '../repositories/speciality-repository'
import { ResourceNotFoundError } from './@errors/resource-not-found.error'

interface RegisterSpecialityUseCaseRequest {
  userId: string
  specialityData: {
    name: string
    photo?: string
    price: number
    time: string
  }
}

type RegisterSpecialityUseCaseResponse = Either<
  ForbbidenActionError | ResourceNotFoundError,
  {
    speciality: Speciality
  }
>

@Injectable()
export class RegisterSpecialityUseCase {
  constructor(
    private usersRepository: UsersRepository,
    private specialityRepository: SpecialityRepository,
  ) {}

  async execute({
    userId,
    specialityData,
  }: RegisterSpecialityUseCaseRequest): Promise<RegisterSpecialityUseCaseResponse> {
    const userExists = await this.usersRepository.findById(userId)

    // Verifying if user has permission to create a speciality
    if (userExists?.role !== UserRole.ADMIN) {
      return left(new ForbbidenActionError())
    }

    const { name, price, time, photo } = specialityData

    const speciality = Speciality.create({
      name,
      price,
      time,
      photo,
    })

    await this.specialityRepository.create(speciality)

    return right({
      speciality,
    })
  }
}
