import { Entity } from 'src/core/entities/entity'
import { UniqueEntityID } from 'src/core/entities/unique-entity-id'
import { Optional } from 'src/core/types/optional'
import { Appointment } from './appointment'

export enum UserRole {
  CLIENT = 'client',
  ADMIN = 'admin',
}

export interface UserProps {
  name: string
  email: string
  password: string
  role: UserRole
  appointments?: Appointment[]
  createdAt: Date
  updatedAt?: Date | null
}

export class User extends Entity<UserProps> {
  get name() {
    return this.props.name
  }

  set name(name: string) {
    this.props.name = name
    this.touch()
  }

  get email() {
    return this.props.email
  }

  set email(email: string) {
    this.props.email = email
    this.touch()
  }

  get password() {
    return this.props.password
  }

  set password(password: string) {
    this.props.password = password
    this.touch()
  }

  get role() {
    return this.props.role
  }

  set role(role: UserRole) {
    this.props.role = role
    this.touch()
  }

  get appointments() {
    return this.props.appointments
  }

  set appointments(appointments: Appointment[] | undefined) {
    this.props.appointments = appointments
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
    props: Optional<UserProps, 'createdAt' | 'role'>,
    id?: UniqueEntityID,
  ) {
    const user = new User(
      {
        ...props,
        createdAt: props.createdAt ?? new Date(),
        role: props.role ?? UserRole.CLIENT,
      },
      id,
    )

    return user
  }
}
