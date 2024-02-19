import { Entity } from 'src/core/entities/entity'
import { UniqueEntityID } from 'src/core/entities/unique-entity-id'

export interface SpecialityProps {
  name: string
  photo?: string
  price: number
  time: string
}

export class Speciality extends Entity<SpecialityProps> {
  get name() {
    return this.props.name
  }

  set name(name: string) {
    this.props.name = name
  }

  get photo() {
    return this.props.photo
  }

  set photo(photo: string | undefined) {
    this.props.photo = photo
  }

  get price() {
    return this.props.price
  }

  set price(price: number) {
    this.props.price = price
  }

  get time() {
    return this.props.time
  }

  set time(time: string) {
    this.props.time = time
  }

  static create(props: SpecialityProps, id?: UniqueEntityID) {
    const speciality = new Speciality(props, id)

    return speciality
  }
}
