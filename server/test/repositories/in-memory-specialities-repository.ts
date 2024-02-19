import { SpecialityRepository } from 'src/domain/barbershop/application/repositories/speciality-repository'
import { Speciality } from 'src/domain/barbershop/enterprise/entities/speciality'

export class InMemorySpecialityRepository implements SpecialityRepository {
  public items: Speciality[] = []

  async findById(specialityId: string) {
    const speciality = this.items.find(
      (item) => item.id.toString() === specialityId,
    )

    if (!speciality) {
      return null
    }

    return speciality
  }

  async findAll() {
    return this.items
  }

  async create(speciality: Speciality) {
    this.items.push(speciality)
    return speciality
  }

  async save(speciality: Speciality) {
    const itemIndex = this.items.findIndex((item) => item.id === speciality.id)

    this.items[itemIndex] = speciality
    return speciality
  }
}
