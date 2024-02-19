import { InMemoryUsersRepository } from 'test/repositories/in-memory-users-repository'
import { makeUser } from 'test/factories/make-user'
import { MakeAppointmentUseCase } from './make-appointment'
import { InMemoryBarberRepository } from 'test/repositories/in-memory-barbers-repository'
import { InMemoryAppointmentRepository } from 'test/repositories/in-memory-appointments-repository'
import { makeBarber } from 'test/factories/make-barber'
import { makeSpeciality } from 'test/factories/make-speciality'
import { InMemorySpecialityRepository } from 'test/repositories/in-memory-specialities-repository'
import { makeAppointment } from 'test/factories/make-appointment'
import { SlotAlreadyReservedError } from './@errors/slot-already-reserved.error'

let inMemoryUsersRepository: InMemoryUsersRepository
let inMemoryBarberRepository: InMemoryBarberRepository
let inMemoryAppointmentRepository: InMemoryAppointmentRepository
let inMemorySpecialityRepository: InMemorySpecialityRepository

let sut: MakeAppointmentUseCase

describe('Make Appointment', () => {
  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository()
    inMemoryBarberRepository = new InMemoryBarberRepository()
    inMemoryAppointmentRepository = new InMemoryAppointmentRepository()
    inMemorySpecialityRepository = new InMemorySpecialityRepository()

    sut = new MakeAppointmentUseCase(
      inMemoryUsersRepository,
      inMemoryBarberRepository,
      inMemoryAppointmentRepository,
    )
  })

  it('should be able to make a new appointment', async () => {
    const user = makeUser()
    const speciality = makeSpeciality()
    const barber = makeBarber({
      specialities: [speciality],
    })

    await inMemoryUsersRepository.create(user)
    await inMemorySpecialityRepository.create(speciality)
    await inMemoryBarberRepository.create(barber)

    const result = await sut.execute({
      appointment: {
        barberId: barber.id.toString(),
        clientId: user.id.toString(),
        day: new Date(),
        hour: '14:00',
        appointmentServices: [speciality.id.toString()],
      },
    })

    expect(result.isRight()).toBeTruthy()
  })

  it('should not be able to make a new appointment in already reserved slot', async () => {
    const user = makeUser()
    const speciality = makeSpeciality()
    const barber = makeBarber({
      specialities: [speciality],
    })
    const appointment = makeAppointment({
      barberId: barber.id,
      clientId: user.id,
      day: new Date(),
      hour: '14:00',
    })

    await inMemoryUsersRepository.create(user)
    await inMemorySpecialityRepository.create(speciality)
    await inMemoryAppointmentRepository.create(appointment)
    await inMemoryBarberRepository.create(barber)

    const result = await sut.execute({
      appointment: {
        barberId: barber.id.toString(),
        clientId: user.id.toString(),
        day: new Date(),
        hour: '14:00',
        appointmentServices: [speciality.id.toString()],
      },
    })

    expect(result.isLeft()).toBeTruthy()
    expect(result.value).toBeInstanceOf(SlotAlreadyReservedError)
  })
})