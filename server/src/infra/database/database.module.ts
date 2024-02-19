import { Module } from '@nestjs/common'
import { PrismaService } from './prisma/prisma.service'
import { UsersRepository } from 'src/domain/barbershop/application/repositories/users-repository'
import { PrismaUsersRepository } from './prisma/repositories/prisma-user-repository'
import { PrismaBarberRepository } from './prisma/repositories/prisma-barber-repository'
import { BarberRepository } from 'src/domain/barbershop/application/repositories/barber-repository'
import { SpecialityRepository } from 'src/domain/barbershop/application/repositories/speciality-repository'
import { PrismaSpecialityRepository } from './prisma/repositories/prisma-speciality-repository'
import { PrismaAppointmentRepository } from './prisma/repositories/prisma-appointment-repository'
import { AppointmentRepository } from 'src/domain/barbershop/application/repositories/appointment-repository'

@Module({
  providers: [
    PrismaService,
    {
      provide: UsersRepository,
      useClass: PrismaUsersRepository,
    },
    {
      provide: BarberRepository,
      useClass: PrismaBarberRepository,
    },
    {
      provide: SpecialityRepository,
      useClass: PrismaSpecialityRepository,
    },
    {
      provide: AppointmentRepository,
      useClass: PrismaAppointmentRepository,
    },
  ],
  exports: [
    PrismaService,
    UsersRepository,
    BarberRepository,
    SpecialityRepository,
    AppointmentRepository,
  ],
})
export class DatabaseModule {}
