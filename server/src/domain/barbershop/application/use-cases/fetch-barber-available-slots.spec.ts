import { FetchBarberAvailableSlotsUseCase } from './fetch-barber-available-slots'
import { InMemoryAppointmentRepository } from 'test/repositories/in-memory-appointments-repository'
import dayjs from 'dayjs'
import { makeAppointment } from 'test/factories/make-appointment'
import { makeBarber } from 'test/factories/make-barber'
import { InMemoryBarberRepository } from 'test/repositories/in-memory-barbers-repository'

let inMemoryAppointmentRepository: InMemoryAppointmentRepository
let inMemoryBarberRepository: InMemoryBarberRepository

let sut: FetchBarberAvailableSlotsUseCase

describe('Fetch available barber slots on the day', () => {
  beforeEach(() => {
    inMemoryAppointmentRepository = new InMemoryAppointmentRepository()
    inMemoryBarberRepository = new InMemoryBarberRepository()

    sut = new FetchBarberAvailableSlotsUseCase(
      inMemoryAppointmentRepository,
      inMemoryBarberRepository,
    )
  })

  it('should be able to fetch for barber slots available on the day', async () => {
    const barber = makeBarber()

    await inMemoryBarberRepository.create(barber)

    const appointment = makeAppointment({
      dateTime: dayjs().add(1, 'hour').toDate(),
      barberId: barber.id,
    })

    inMemoryAppointmentRepository.create(appointment)

    const result = await sut.execute({
      date: dayjs().toDate(),
      barberId: barber.id.toString(),
    })

    const reservedSlots = dayjs(appointment.dateTime).format('HH:mm')

    expect(result.isRight).toBeTruthy()
    // horário reservado não deve aparecer nos horários livres
    if (result.isLeft()) return
    expect(result.value?.availableSlots).not.contains(reservedSlots)
  })
})
