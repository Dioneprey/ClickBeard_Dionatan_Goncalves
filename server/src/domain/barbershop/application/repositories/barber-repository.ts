import { Barber } from '../../enterprise/entities/barber'

export abstract class BarbersRepository {
  abstract findAll(): Promise<Barber[]>
  abstract create(barber: Barber): Promise<Barber>
  abstract save(barber: Barber): Promise<Barber>
}
