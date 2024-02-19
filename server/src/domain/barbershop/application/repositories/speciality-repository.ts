import { Speciality } from '../../enterprise/entities/speciality'

export abstract class SpecialityRepository {
  abstract findById(id: string): Promise<Speciality | null>
  abstract findAll(): Promise<Speciality[]>
  abstract create(speciality: Speciality): Promise<Speciality>
  abstract save(speciality: Speciality): Promise<Speciality>
}
