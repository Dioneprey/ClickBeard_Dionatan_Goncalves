import { Speciality } from '../../enterprise/entities/speciality'

export abstract class SpecialitiesRepository {
  abstract findAll(): Promise<Speciality[]>
  abstract create(speciality: Speciality): Promise<Speciality>
  abstract save(speciality: Speciality): Promise<Speciality>
}
