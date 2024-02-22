import { Processor, Process, InjectQueue } from '@nestjs/bull'
import { Job, Queue } from 'bull'
import { SendEmail } from 'src/domain/barbershop/application/mail/send-email'
import { AppointmentRepository } from 'src/domain/barbershop/application/repositories/appointment-repository'
import { AppointmentStatus } from 'src/domain/barbershop/enterprise/entities/appointment'

@Processor('appointment-processor')
export class HandleAppointmentStatusProcessor {
  constructor(
    private appointmentRepository: AppointmentRepository,
    private sendEmail: SendEmail,
    @InjectQueue('appointment-processor')
    private handleappointmentStatusQueue: Queue,
  ) {}

  @Process('notify-start-of-schedule-appointment')
  async notifyStartOfAppointment({ data: clientEmail }: Job<string>) {
    await this.sendEmail.send({
      message: 'Seu agendamento na clickBeard começará em uma hora',
      recipientEmail: clientEmail,
    })
  }

  @Process('start-schedule-appointment')
  async startAppointment({ data: appointmentId }: Job<string>) {
    const appointment = await this.appointmentRepository.findById({
      appointmentId,
    })

    if (!appointment) return
    appointment.status = AppointmentStatus.IN_PROGRESS

    await this.appointmentRepository.save(appointment)

    await this.handleappointmentStatusQueue.add(
      'complete-schedule-appointment',
      appointment.id.toString(),
      {
        delay: 4000,
      },
    )
  }

  @Process('complete-schedule-appointment')
  async endAppointment({ data: appointmentId }: Job<string>) {
    const appointment = await this.appointmentRepository.findById({
      appointmentId,
    })

    if (!appointment) return
    appointment.status = AppointmentStatus.COMPLETED

    await this.appointmentRepository.save(appointment)
  }
}
