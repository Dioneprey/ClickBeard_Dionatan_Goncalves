import { BarberRepository } from 'src/domain/barbershop/application/repositories/barber-repository'
import { Barber } from 'src/domain/barbershop/enterprise/entities/barber'

export class InMemoryBarberRepository implements BarberRepository {
  public items: Barber[] = []

  async findById(barberId: string) {
    const barber = this.items.find((item) => item.id.toString() === barberId)

    if (!barber) {
      return null
    }

    return barber
  }

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
