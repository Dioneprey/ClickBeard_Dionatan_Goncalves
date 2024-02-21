import {
  Prisma,
  Appointment as PrismaAppointment,
  Speciality as PrismaSpeciality,
  Barber as PrismaBarber,
  User as PrismaUser,
} from '@prisma/client'
import { UniqueEntityID } from 'src/core/entities/unique-entity-id'
import {
  Appointment,
  AppointmentStatus,
} from 'src/domain/barbershop/enterprise/entities/appointment'
import { Barber } from 'src/domain/barbershop/enterprise/entities/barber'
import { Speciality } from 'src/domain/barbershop/enterprise/entities/speciality'
import { User, UserRole } from 'src/domain/barbershop/enterprise/entities/user'

export class PrismaAppointmentMapper {
  static toDomain(
    raw: PrismaAppointment & {
      Service?: PrismaSpeciality
      Barber?: PrismaBarber
      Client?: PrismaUser
    },
  ): Appointment {
    return Appointment.create(
      {
        barberId: new UniqueEntityID(raw.barberId),
        clientId: new UniqueEntityID(raw.clientId),
        day: raw.day,
        hour: raw.hour,
        status: AppointmentStatus[raw.status],
        serviceId: new UniqueEntityID(raw.serviceId),
        service:
          raw.Service &&
          Speciality.create({
            name: raw.Service?.name,
            price: raw.Service?.price,
            time: raw.Service?.time,
            photo: raw.Service?.photo ?? undefined,
          }),
        barber:
          raw.Barber &&
          Barber.create(
            {
              ...raw.Barber,
              photo: raw.Barber.photo ?? '',
            },
            new UniqueEntityID(raw.Barber.id),
          ),
        client:
          raw.Client &&
          User.create(
            {
              ...raw.Client,
              role: UserRole[raw.Client.role],
            },
            new UniqueEntityID(raw.Client.id),
          ),
        createdAt: raw.createdAt,
        updatedAt: raw.updatedAt,
      },
      new UniqueEntityID(raw.id),
    )
  }

  static toPrisma(
    appointment: Appointment,
  ): Prisma.AppointmentUncheckedCreateInput {
    const appointmentStatus =
      appointment.status === AppointmentStatus.SCHEDULED
        ? 'SCHEDULED'
        : appointment.status === AppointmentStatus.COMPLETED
          ? 'COMPLETED'
          : appointment.status === AppointmentStatus.CANCELLED
            ? 'CANCELLED'
            : appointment.status === AppointmentStatus.IN_PROGRESS
              ? 'IN_PROGRESS'
              : 'CANCELLED'

    return {
      id: appointment.id.toString(),
      barberId: appointment.barberId.toString(),
      clientId: appointment.clientId.toString(),
      serviceId: appointment.serviceId.toString(),
      day: appointment.day,
      hour: appointment.hour,
      status: appointmentStatus,
      createdAt: appointment.createdAt,
      updatedAt: appointment.updatedAt,
    }
  }
}
