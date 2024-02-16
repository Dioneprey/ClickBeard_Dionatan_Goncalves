import { BarbersRepository } from 'src/domain/barbershop/application/repositories/barber-repository'
import { Barber } from 'src/domain/barbershop/enterprise/entities/barber'

export class InMemoryBarbersRepository implements BarbersRepository {
  public items: Barber[] = []

  async findAll() {
    return this.items
  }

  async create(barber: Barber) {
    this.items.push(barber)
    return barber
  }

  async save(barber: Barber) {
    const itemIndex = this.items.findIndex((item) => item.id === barber.id)

    this.items[itemIndex] = barber
    return barber
  }
}
