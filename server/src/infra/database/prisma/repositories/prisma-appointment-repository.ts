import { Injectable } from '@nestjs/common'
import { PrismaService } from '../prisma.service'
import {
  AppointmentRepository,
  AppointmentRepositoryFindAllByDayProps,
} from 'src/domain/barbershop/application/repositories/appointment-repository'
import { Appointment } from 'src/domain/barbershop/enterprise/entities/appointment'
import { PrismaAppointmentMapper } from '../mapper/prisma-appointment-mapper'
import dayjs from 'dayjs'

@Injectable()
export class PrismaAppointmentRepository implements AppointmentRepository {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    const appointments = await this.prisma.appointment.findMany({
      include: {
        AppointmentServices: {
          select: {
            service: true,
          },
        },
      },
    })

    return appointments.map(PrismaAppointmentMapper.toDomain)
  }

  async findAllByDay({
    date,
    barberId,
  }: AppointmentRepositoryFindAllByDayProps) {
    const dayStart = dayjs(date).startOf('day').toDate()
    const dayEnd = dayjs(date).endOf('day').toDate()

    const appointments = await this.prisma.appointment.findMany({
      where: {
        day: {
          gte: dayStart,
          lte: dayEnd,
        },
        barberId,
      },
    })

    return appointments.map(PrismaAppointmentMapper.toDomain)
  }

  async create(appointment: Appointment) {
    const data = PrismaAppointmentMapper.toPrisma(appointment)

    const servicesConnect =
      appointment?.servicesId?.map((service) => {
        return {
          serviceId: service.toString(),
        }
      }) ?? []

    const newAppointment = await this.prisma.appointment.create({
      data: {
        ...data,
        AppointmentServices: {
          createMany: {
            data: servicesConnect,
          },
        },
      },
    })

    return PrismaAppointmentMapper.toDomain(newAppointment)
  }

  async save(appointment: Appointment) {
    const data = PrismaAppointmentMapper.toPrisma(appointment)

    const updatedAppointment = await this.prisma.appointment.update({
      where: {
        id: data.id,
      },
      data,
    })

    return PrismaAppointmentMapper.toDomain(updatedAppointment)
  }
}
