import { InMemoryUsersRepository } from 'test/repositories/in-memory-users-repository'
import { makeUser } from 'test/factories/make-user'
import { InMemoryAppointmentRepository } from 'test/repositories/in-memory-appointments-repository'
import { CancelAppointmentUseCase } from './cancel-appointment'
import { makeAppointment } from 'test/factories/make-appointment'
import dayjs from 'dayjs'
import { ForbbidenActionError } from './@errors/forbbiden-action.error'
import { AppointmentStatus } from '../../enterprise/entities/appointment'

let inMemoryUsersRepository: InMemoryUsersRepository
let inMemoryAppointmentRepository: InMemoryAppointmentRepository

let sut: CancelAppointmentUseCase

describe('Cancel Appointment', () => {
  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository()
    inMemoryAppointmentRepository = new InMemoryAppointmentRepository()

    sut = new CancelAppointmentUseCase(
      inMemoryUsersRepository,
      inMemoryAppointmentRepository,
    )
  })

  it('should be able to cancel a appointment', async () => {
    const user = makeUser()
    const appointment = makeAppointment({
      clientId: user.id,
      day: dayjs().add(1, 'days').toDate(),
    })

    await inMemoryUsersRepository.create(user)
    await inMemoryAppointmentRepository.create(appointment)

    const result = await sut.execute({
      userId: user.id.toString(),
      appointmentId: appointment.id.toString(),
    })

    expect(result.isRight()).toBeTruthy()
    expect(
      inMemoryAppointmentRepository.items[0].status ===
        AppointmentStatus.CANCELLED,
    ).toBe(true)
  })

  it('should not be able to cancel an appointment with less than two hours until the appointment', async () => {
    const user = makeUser()

    const date = new Date() // Substitua por sua data específica, se necessário

    const hours = date.getHours().toString().padStart(2, '0')
    const minutes = date.getMinutes().toString().padStart(2, '0')

    const hourSlot = `${hours}:${minutes}`

    const appointment = makeAppointment({
      clientId: user.id,
      day: date,
      hour: hourSlot,
    })

    await inMemoryUsersRepository.create(user)
    await inMemoryAppointmentRepository.create(appointment)

    const result = await sut.execute({
      userId: user.id.toString(),
      appointmentId: appointment.id.toString(),
    })

    expect(result.isLeft()).toBeTruthy()
    expect(result.value).toBeInstanceOf(ForbbidenActionError)
  })
})
