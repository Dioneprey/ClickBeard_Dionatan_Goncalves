import { Entity } from 'src/core/entities/entity'
import { UniqueEntityID } from 'src/core/entities/unique-entity-id'
import { Optional } from 'src/core/types/optional'

export enum AppointmentStatus {
  SCHEDULED = 'scheduled',
  COMPLETED = 'completed',
  CANCELLED = 'canceled',
}

export interface AppointmentProps {
  day: Date
  hour: string
  clientId: UniqueEntityID
  barberId: UniqueEntityID
  status: AppointmentStatus
  createdAt: Date
  updatedAt?: Date | null
}

export class Appointment extends Entity<AppointmentProps> {
  get day() {
    return this.props.day
  }

  set day(day: Date) {
    this.props.day = day
  }

  get hour() {
    return this.props.hour
  }

  set hour(hour: string) {
    this.props.hour = hour
  }

  get clientId() {
    return this.props.clientId
  }

  set clientId(clientId: UniqueEntityID) {
    this.props.clientId = clientId
  }

  get barberId() {
    return this.props.barberId
  }

  set barberId(barberId: UniqueEntityID) {
    this.props.barberId = barberId
  }

  get status() {
    return this.props.status
  }

  set status(status: AppointmentStatus) {
    this.props.status = status
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
        status: AppointmentStatus.SCHEDULED,
      },
      id,
    )

    return appointment
  }
}
