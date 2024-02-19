import { Speciality } from 'src/domain/barbershop/enterprise/entities/speciality'

export class SpecialityPresenter {
  static toHTTP(speciality: Speciality | null) {
    if (speciality === null) {
      return {}
    }

    return {
      id: speciality.id.toString(),
      name: speciality.name,
      photo: speciality?.photo,
      price: speciality.price,
      time: speciality?.time,
    }
  }
}
