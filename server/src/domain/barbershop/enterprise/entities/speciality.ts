import { Entity } from 'src/core/entities/entity'
import { UniqueEntityID } from 'src/core/entities/unique-entity-id'

export interface SpecialityProps {
  name: string
}

export class Speciality extends Entity<SpecialityProps> {
  get name() {
    return this.props.name
  }

  set name(name: string) {
    this.props.name = name
  }

  static create(props: SpecialityProps, id?: UniqueEntityID) {
    const speciality = new Speciality(props, id)

    return speciality
  }
}
