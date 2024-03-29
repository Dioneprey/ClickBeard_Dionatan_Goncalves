import { Entity } from 'src/core/entities/entity'
import { UniqueEntityID } from 'src/core/entities/unique-entity-id'
import { Appointment } from './appointment'
import { Speciality } from './speciality'
import { Optional } from 'src/core/types/optional'

export interface BarberProps {
  name: string
  birthDate: Date
  hiringDate: Date
  photo?: string
  appointmentsId?: UniqueEntityID[]
  appointments?: Appointment[]
  specialitiesId?: UniqueEntityID[]
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

  get photo() {
    return this.props.photo
  }

  set photo(photo: string | undefined) {
    this.props.photo = photo
  }

  get appointmentsId() {
    return this.props.appointmentsId
  }

  set appointmentsId(appointmentsId: UniqueEntityID[] | undefined) {
    this.props.appointmentsId = appointmentsId
  }

  get appointments() {
    return this.props.appointments
  }

  set appointments(appointments: Appointment[] | undefined) {
    this.props.appointments = appointments
  }

  get specialitiesId() {
    return this.props.specialitiesId
  }

  set specialitiesId(specialitiesId: UniqueEntityID[] | undefined) {
    this.props.specialitiesId = specialitiesId
  }

  get specialities() {
    return this.props.specialities
  }

  set specialities(specialities: Speciality[] | undefined) {
    this.props.specialities = specialities
  }

  static create(
    props: Optional<BarberProps, 'hiringDate'>,
    id?: UniqueEntityID,
  ) {
    const barber = new Barber(
      {
        ...props,
        hiringDate: props.hiringDate ?? new Date(),
      },
      id,
    )

    return barber
  }
}
