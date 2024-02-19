import { Barber } from '../../enterprise/entities/barber'

export abstract class BarberRepository {
  abstract findById(id: string): Promise<Barber | null>
  abstract findAll(): Promise<Barber[]>
  abstract create(barber: Barber): Promise<Barber>
  abstract save(barber: Barber): Promise<Barber>
}
