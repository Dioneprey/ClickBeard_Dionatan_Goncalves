import { Appointment } from 'src/domain/barbershop/enterprise/entities/appointment'
import { SpecialityPresenter } from './speciality-presenter'
import { BarberPresenter } from './barber-presenter'

export class AppointmentPresenter {
  static toHTTP(appointment: Appointment | null) {
    if (appointment === null) {
      return {}
    }

    return {
      id: appointment.id.toString,
      barberId: appointment.barberId.toString,
      clientId: appointment.clientId.toString,
      day: appointment.day,
      hour: appointment.hour,
      status: appointment.status,
      createdAt: appointment.createdAt,
      service:
        appointment.service && SpecialityPresenter.toHTTP(appointment.service),
      barber: appointment.barber && BarberPresenter.toHTTP(appointment.barber),
    }
  }
}
