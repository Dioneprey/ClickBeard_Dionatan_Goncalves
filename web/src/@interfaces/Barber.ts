import { Speciality } from './Speciality'

export interface Barber {
  id: string
  name: string
  photo?: string
  hiringDate: Date
  birthDate: Date
  specialities: Speciality[]
}
