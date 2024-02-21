import { Entity } from 'src/core/entities/entity'
import { UniqueEntityID } from 'src/core/entities/unique-entity-id'
import { Optional } from 'src/core/types/optional'
import { Speciality } from './speciality'
import { Barber } from './barber'
import { User } from './user'

export enum AppointmentStatus {
  SCHEDULED = 'scheduled',
  COMPLETED = 'completed',
  CANCELLED = 'canceled',
  IN_PROGRESS = 'in_progress',
}

export interface AppointmentProps {
  day: Date
  hour: string
  status: AppointmentStatus
  serviceId: UniqueEntityID
  service?: Speciality
  barberId: UniqueEntityID
  barber?: Barber
  clientId: UniqueEntityID
  client?: User
  createdAt: Date
  updatedAt?: Date | null
}

export class Appointment extends Entity<AppointmentProps> {
  get day() {
    return this.props.day
  }

  set day(day: Date) {
    this.props.day = day
    this.touch()
  }

  get hour() {
    return this.props.hour
  }

  set hour(hour: string) {
    this.props.hour = hour
    this.touch()
  }

  get clientId() {
    return this.props.clientId
  }

  set clientId(clientId: UniqueEntityID) {
    this.props.clientId = clientId
    this.touch()
  }

  get client() {
    return this.props.client
  }

  set client(client: User | undefined) {
    this.props.client = client
    this.touch()
  }

  get status() {
    return this.props.status
  }

  set status(status: AppointmentStatus) {
    this.props.status = status
    this.touch()
  }

  get serviceId() {
    return this.props.serviceId
  }

  set serviceId(serviceId: UniqueEntityID) {
    this.props.serviceId = serviceId
    this.touch()
  }

  get service() {
    return this.props.service
  }

  set service(service: Speciality | undefined) {
    this.props.service = service
    this.touch()
  }

  get barberId() {
    return this.props.barberId
  }

  set barberId(barberId: UniqueEntityID) {
    this.props.barberId = barberId
    this.touch()
  }

  get barber() {
    return this.props.barber
  }

  set barber(barber: Barber | undefined) {
    this.props.barber = barber
    this.touch()
  }

  get createdAt() {
    return this.props.createdAt
  }

  get updatedAt() {
    return this.props.updatedAt
  }

  private touch() {
    this.props.updatedAt = new Date()
  }

  static create(
    props: Optional<AppointmentProps, 'createdAt' | 'status'>,
    id?: UniqueEntityID,
  ) {
    const appointment = new Appointment(
      {
        ...props,
        createdAt: props.createdAt ?? new Date(),
        status: props.status ?? AppointmentStatus.SCHEDULED,
      },
      id,
    )

    return appointment
  }
}
