import { InMemoryAppointmentRepository } from 'test/repositories/in-memory-appointments-repository'
import dayjs from 'dayjs'
import { makeAppointment } from 'test/factories/make-appointment'
import { makeBarber } from 'test/factories/make-barber'
import { InMemoryUsersRepository } from 'test/repositories/in-memory-users-repository'
import { FetchAppointmentsUseCase } from './fetch-appointments'
import { makeUser } from 'test/factories/make-user'
import { InMemoryBarberRepository } from 'test/repositories/in-memory-barbers-repository'
import { UserRole } from '../../enterprise/entities/user'

let inMemoryAppointmentRepository: InMemoryAppointmentRepository
let inMemoryUsersRepository: InMemoryUsersRepository
let inMemoryBarberRepository: InMemoryBarberRepository

let sut: FetchAppointmentsUseCase

describe('Fetch appointments', () => {
  beforeEach(() => {
    inMemoryAppointmentRepository = new InMemoryAppointmentRepository()
    inMemoryUsersRepository = new InMemoryUsersRepository()
    inMemoryBarberRepository = new InMemoryBarberRepository()

    sut = new FetchAppointmentsUseCase(
      inMemoryUsersRepository,
      inMemoryAppointmentRepository,
    )
  })

  it('should be able to fetch appointments', async () => {
    const user = makeUser()
    const barber = makeBarber()

    await inMemoryUsersRepository.create(user)
    await inMemoryBarberRepository.create(barber)

    inMemoryAppointmentRepository.create(
      makeAppointment({
        day: dayjs().add(1, 'day').startOf('day').toDate(),
        barberId: barber.id,
        clientId: user.id,
        hour: '14:00',
      }),
    )
    inMemoryAppointmentRepository.create(
      makeAppointment({
        day: dayjs().add(1, 'day').startOf('day').toDate(),
        barberId: barber.id,
        clientId: user.id,
        hour: '15:00',
      }),
    )

    const result = await sut.execute({
      userId: user.id.toString(),
      pageIndex: 0,
    })

    expect(result.isRight()).toBe(true)
    if (result.isLeft()) return
    expect(result.value.appointments).toHaveLength(2)
  })

  it('should be able to fetch all appointments being an admin', async () => {
    const user = makeUser({
      role: UserRole.ADMIN,
    })
    const barber = makeBarber()

    await inMemoryUsersRepository.create(user)
    await inMemoryBarberRepository.create(barber)

    inMemoryAppointmentRepository.create(
      makeAppointment({
        day: dayjs().add(1, 'day').startOf('day').toDate(),
        barberId: barber.id,
        hour: '14:00',
      }),
    )
    inMemoryAppointmentRepository.create(
      makeAppointment({
        day: dayjs().add(1, 'day').startOf('day').toDate(),
        barberId: barber.id,
        hour: '15:00',
      }),
    )

    const result = await sut.execute({
      userId: user.id.toString(),
      pageIndex: 0,
    })

    expect(result.isRight()).toBe(true)
    if (result.isLeft()) return
    expect(result.value.appointments).toHaveLength(2)
  })
})
