import { Injectable } from '@nestjs/common'
import { PrismaService } from '../prisma.service'
import {
  AppointmentRepository,
  AppointmentRepositoryFindAllByClientIdParams,
  AppointmentRepositoryFindAllByDayProps,
  AppointmentRepositoryFindAllParams,
  AppointmentRepositoryFindByIdParams,
} from 'src/domain/barbershop/application/repositories/appointment-repository'
import { Appointment } from 'src/domain/barbershop/enterprise/entities/appointment'
import { PrismaAppointmentMapper } from '../mapper/prisma-appointment-mapper'
import dayjs from 'dayjs'
import { AppointmentStatus } from '@prisma/client'
import { InjectQueue } from '@nestjs/bull'
import { Queue } from 'bull'
import { SSEService } from 'src/infra/events/sse-service'

@Injectable()
export class PrismaAppointmentRepository implements AppointmentRepository {
  constructor(
    private prisma: PrismaService,
    private sseService: SSEService,
    @InjectQueue('appointment-processor')
    private handleappointmentStatusQueue: Queue,
  ) {}

  async findById({
    appointmentId,
    userId,
  }: AppointmentRepositoryFindByIdParams) {
    const appointment = await this.prisma.appointment.findFirst({
      where: {
        id: appointmentId,
        clientId: userId,
      },
    })

    if (!appointment) {
      return null
    }

    return PrismaAppointmentMapper.toDomain(appointment)
  }

  async findAll({ pageIndex, filters }: AppointmentRepositoryFindAllParams) {
    const status =
      filters?.status === 'completed'
        ? AppointmentStatus.COMPLETED
        : filters?.status === 'canceled'
          ? AppointmentStatus.CANCELLED
          : filters?.status === 'scheduled'
            ? AppointmentStatus.SCHEDULED
            : filters?.status === 'in_progress'
              ? AppointmentStatus.IN_PROGRESS
              : undefined

    const date = filters?.date

    const startOfDay = dayjs(date).startOf('day').toDate()

    const endOfDay = dayjs(date).endOf('day').toDate()

    const [appointments, totalCount] = await Promise.all([
      this.prisma.appointment.findMany({
        where: {
          status,
          day: date
            ? {
                gte: startOfDay,
                lte: endOfDay,
              }
            : undefined,
        },
        include: {
          Service: true,
          Barber: true,
          Client: true,
        },
        orderBy: {
          createdAt: 'desc',
        },
        skip: pageIndex * 10,
        take: 10,
      }),
      this.prisma.appointment.count({
        where: {
          status,
        },
      }),
    ])

    const totalPages = Math.ceil(totalCount / 10)

    return {
      data: appointments.map(PrismaAppointmentMapper.toDomain),
      pageIndex,
      totalCount,
      totalPages,
    }
  }

  async findAllByClientId({
    clientId,
    pageIndex,
    filters,
  }: AppointmentRepositoryFindAllByClientIdParams) {
    const status = filters?.status
      ? AppointmentStatus[filters?.status]
      : undefined

    const date = filters?.date

    const startOfDay = dayjs(date).startOf('day').toDate()

    const endOfDay = dayjs(date).endOf('day').toDate()

    const [appointments, totalCount] = await Promise.all([
      this.prisma.appointment.findMany({
        where: {
          status,
          day: {
            gte: startOfDay,
            lte: endOfDay,
          },
        },
        include: {
          Service: true,
          Barber: true,
          Client: true,
        },
        orderBy: {
          createdAt: 'desc',
        },
        skip: pageIndex * 10,
        take: 10,
      }),
      this.prisma.appointment.count({
        where: {
          status,
          clientId,
        },
      }),
    ])

    const totalPages = Math.ceil(totalCount / 10)

    return {
      data: appointments.map(PrismaAppointmentMapper.toDomain),
      pageIndex,
      totalCount,
      totalPages,
    }
  }

  async findAllByDay({
    date,
    barberId,
    onlyPendents,
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
        status: onlyPendents ? 'SCHEDULED' : undefined,
      },
    })

    return appointments.map(PrismaAppointmentMapper.toDomain)
  }

  async create(appointment: Appointment) {
    const data = PrismaAppointmentMapper.toPrisma(appointment)

    const newAppointment = await this.prisma.appointment.create({
      data,
    })

    this.sseService.emitEvent('change-appointment')

    // Pegando delay de uma hora antes do agendamento para mandar notificação

    const oneHourBeforeAppointment = new Date(
      appointment.day.getTime() - 60 * 60 * 1000,
    )

    const notifyAppointmentDelay =
      oneHourBeforeAppointment.getTime() - Date.now()

    await this.handleappointmentStatusQueue.add(
      'notify-start-of-schedule-appointment',
      appointment.client?.email,
      {
        delay: notifyAppointmentDelay,
      },
    )

    if (notifyAppointmentDelay > 0) {
      // Agendar a notificação, pois há mais de uma hora até o agendamento.
      await this.handleappointmentStatusQueue.add(
        'notify-start-of-schedule-appointment',
        appointment.client?.email,
        {
          delay: notifyAppointmentDelay,
        },
      )
    }

    // Pegando delay da hora exata do agendamento para iniciar agendamento

    const appointmentTime = appointment.day.getTime()

    const startScheduleDelay = appointmentTime - Date.now()

    await this.handleappointmentStatusQueue.add(
      'start-schedule-appointment',
      appointment.id.toString(),
      {
        delay: startScheduleDelay,
      },
    )

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

    this.sseService.emitEvent('change-appointment')

    return PrismaAppointmentMapper.toDomain(updatedAppointment)
  }
}
