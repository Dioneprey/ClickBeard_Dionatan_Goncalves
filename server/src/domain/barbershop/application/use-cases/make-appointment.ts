// import { Either, left, right } from 'src/core/either'
// import { UserRole } from '../../enterprise/entities/user'
// import { Injectable } from '@nestjs/common'
// import { UsersRepository } from '../repositories/users-repository'
// import { ForbbidenActionError } from './@errors/forbbiden-action.error'
// import { Barber } from '../../enterprise/entities/barber'
// import { Speciality } from '../../enterprise/entities/speciality'
// import { BarberRepository } from '../repositories/barber-repository'

// interface MakeAppointmentUseCaseRequest {
//   userId: string
//   barberData: {
//     name: string
//     birthDate: Date
//     hiringDate: Date
//     specialities: string[]
//   }
// }

// type MakeAppointmentUseCaseResponse = Either<
//   ForbbidenActionError,
//   {
//     barber: Barber
//   }
// >

// @Injectable()
// export class MakeAppointmentUseCase {
//   constructor(
//     private usersRepository: UsersRepository,
//     private BarberRepository: BarberRepository,
//   ) {}

//   async execute({
//     userId,
//     barberData,
//   }: MakeAppointmentUseCaseRequest): Promise<MakeAppointmentUseCaseResponse> {
//     const userExists = await this.usersRepository.findById(userId)

//     barber.specialities = barberSpecialities

//     await this.BarberRepository.create(barber)

//     return right({
//       barber,
//     })
//   }
// }
