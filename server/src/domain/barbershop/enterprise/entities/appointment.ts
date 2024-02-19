import { Entity } from 'src/core/entities/entity'
import { UniqueEntityID } from 'src/core/entities/unique-entity-id'
import { Optional } from 'src/core/types/optional'
/* 
model Appointment {
    id        String            @id @default(uuid())
    dateTime  DateTime
    clientId  String
    barberId  String
    status    AppointmentStatus @default(SCHEDULED)
    createdAt DateTime          @default(now())
    updatedAt DateTime?         @updatedAt

    client              Person                @relation(fields: [clientId], references: [id])
    barber              Barber                @relation(fields: [barberId], references: [personId])
    AppointmentServices AppointmentServices[]
}
*/

export enum AppointmentStatus {
  SCHEDULED = 'scheduled',
  COMPLETED = 'completed',
  CANCELLED = 'canceled',
}

export interface AppointmentProps {
  dateTime: Date
  clientId: UniqueEntityID
  barberId: UniqueEntityID
  status: AppointmentStatus
  createdAt: Date
  updatedAt?: Date | null
}

export class Appointment extends Entity<AppointmentProps> {
  get dateTime() {
    return this.props.dateTime
  }

  set dateTime(dateTime: Date) {
    this.props.dateTime = dateTime
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
