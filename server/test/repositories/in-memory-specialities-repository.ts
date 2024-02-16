import { SpecialitiesRepository } from 'src/domain/barbershop/application/repositories/speciality-repository'
import { Speciality } from 'src/domain/barbershop/enterprise/entities/speciality'

export class InMemorySpecialitiesRepository implements SpecialitiesRepository {
  public items: Speciality[] = []

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
