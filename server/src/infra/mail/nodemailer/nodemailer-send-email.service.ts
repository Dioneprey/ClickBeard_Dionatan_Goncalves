import { MailerService } from '@nestjs-modules/mailer'
import { Injectable } from '@nestjs/common'
import {
  SendEmail,
  SendEmailParams,
} from 'src/domain/barbershop/application/mail/send-email'

@Injectable()
export class NodeMailerSendEmailService implements SendEmail {
  constructor(private mailerService: MailerService) {}

  async send({ recipientEmail, message, subject }: SendEmailParams) {
    try {
    // TODO   await this.mailerService.sendMail({
    //     to: recipientEmail,
    //     subject: subject ?? 'Click Beard',
    //     html: `${message}`,
    //   })

      console.log('E-mail enviado')
    } catch (error) {
      console.log(error)
    }
  }
}
