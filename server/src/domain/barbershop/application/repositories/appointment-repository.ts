import { PaginationProps, PaginationResponse } from 'src/core/types/pagination'
import { Appointment } from '../../enterprise/entities/appointment'

export interface AppointmentRepositoryFindAllByDayProps {
  date: Date
  barberId?: string
  onlyPendents?: boolean
}

export interface AppointmentFilters {
  status?: 'scheduled' | 'completed' | 'canceled' | 'in_progress' | null
  date?: Date
}

export interface AppointmentRepositoryFindAllParams
  extends PaginationProps<AppointmentFilters> {}

export interface AppointmentRepositoryFindAllByClientIdParams
  extends PaginationProps<AppointmentFilters> {
  clientId: string
}

export interface AppointmentRepositoryFindByIdParams {
  appointmentId: string
  userId?: string
}
export abstract class AppointmentRepository {
  abstract findById({
    appointmentId,
    userId,
  }: AppointmentRepositoryFindByIdParams): Promise<Appointment | null>

  abstract findAll({
    pageIndex,
    filters,
  }: AppointmentRepositoryFindAllParams): Promise<
    PaginationResponse<Appointment>
  >

  abstract findAllByClientId({
    clientId,
    pageIndex,
    filters,
  }: AppointmentRepositoryFindAllByClientIdParams): Promise<
    PaginationResponse<Appointment>
  >

  abstract findAllByDay({
    date,
    barberId,
    onlyPendents,
  }: AppointmentRepositoryFindAllByDayProps): Promise<Appointment[]>

  abstract create(appointment: Appointment): Promise<Appointment>
  abstract save(appointment: Appointment): Promise<Appointment>
}
