import { Entity } from 'src/core/entities/entity'
import { UniqueEntityID } from 'src/core/entities/unique-entity-id'
import { Appointment } from './appointment'
import { Speciality } from './speciality'

export interface BarberProps {
  name: string
  birthDate: Date
  hiringDate: Date
  appointments?: Appointment[]
  specialities?: Speciality[]
}

export class Barber extends Entity<BarberProps> {
  get name() {
    return this.props.name
  }

  set name(name: string) {
    this.props.name = name
  }

  get birthDate() {
    return this.props.birthDate
  }

  set birthDate(birthDate: Date) {
    this.props.birthDate = birthDate
  }

  get hiringDate() {
    return this.props.hiringDate
  }

  set hiringDate(hiringDate: Date) {
    this.props.hiringDate = hiringDate
  }

  get appointments() {
    return this.props.appointments
  }

  set appointments(appointments: Appointment[] | undefined) {
    this.props.appointments = appointments
  }

  get specialities() {
    return this.props.specialities
  }

  set specialities(specialities: Speciality[] | undefined) {
    this.props.specialities = specialities
  }

  static create(props: BarberProps, id?: UniqueEntityID) {
    const barber = new Barber(props, id)

    return barber
  }
}
