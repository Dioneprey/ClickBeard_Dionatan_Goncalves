import { Barber } from 'src/domain/barbershop/enterprise/entities/barber'
import { SpecialityPresenter } from './speciality-presenter'

export class BarberPresenter {
  static toHTTP(barber: Barber | null) {
    if (barber === null) {
      return {}
    }

    return {
      id: barber.id.toString(),
      name: barber.name,
      photo: barber.photo,
      hiringDate: barber.hiringDate,
      birthDate: barber.birthDate,
      specialities: barber?.specialities?.map(SpecialityPresenter.toHTTP),
    }
  }
}
