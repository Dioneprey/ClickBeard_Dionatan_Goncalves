import {
  Prisma,
  Appointment as PrismaAppointment,
  Speciality as PrismaSpeciality,
} from '@prisma/client'
import { UniqueEntityID } from 'src/core/entities/unique-entity-id'
import {
  Appointment,
  AppointmentStatus,
} from 'src/domain/barbershop/enterprise/entities/appointment'
import { Speciality } from 'src/domain/barbershop/enterprise/entities/speciality'

export class PrismaAppointmentMapper {
  static toDomain(
    raw: PrismaAppointment & {
      AppointmentServices?: { service: PrismaSpeciality }[]
    },
  ): Appointment {
    return Appointment.create(
      {
        barberId: new UniqueEntityID(raw.barberId),
        clientId: new UniqueEntityID(raw.clientId),
        day: raw.day,
        hour: raw.hour,
        status: AppointmentStatus[raw.status],
        servicesId: raw.AppointmentServices?.map(
          (barberSpeciality) => new UniqueEntityID(barberSpeciality.service.id),
        ),
        services: raw.AppointmentServices?.map((barberSpeciality) =>
          Speciality.create({
            name: barberSpeciality?.service?.name,
            price: barberSpeciality?.service?.price,
            time: barberSpeciality?.service?.time,
            photo: barberSpeciality?.service?.photo ?? undefined,
          }),
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
            : 'CANCELLED'

    return {
      id: appointment.id.toString(),
      barberId: appointment.barberId.toString(),
      clientId: appointment.clientId.toString(),
      day: appointment.day,
      hour: appointment.hour,
      status: appointmentStatus,
      createdAt: appointment.createdAt,
      updatedAt: appointment.updatedAt,
    }
  }
}
