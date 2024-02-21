import { MailerModule } from '@nestjs-modules/mailer'
import { Module } from '@nestjs/common'
import { EnvService } from '../env/env.service'
import { NodeMailerSendEmailService } from './nodemailer/nodemailer-send-email.service'
import { EnvModule } from '../env/env.module'
import { SendEmail } from 'src/domain/barbershop/application/mail/send-email'

@Module({
  imports: [
    MailerModule.forRootAsync({
      inject: [EnvService],
      imports: [EnvModule],
      useFactory: (envService: EnvService) => ({
        transport: {
          host: envService.get('MAIL_HOST') ?? '',
          secure: envService.get('MAIL_SECURE') === 'true',
          port: envService.get('MAIL_PORT') ?? 0,
          auth: {
            user: envService.get('MAIL_USER') ?? '',
            pass: envService.get('MAIL_PASSWORD') ?? '',
          },
        },
      }),
    }),
  ],
  providers: [
    {
      provide: SendEmail,
      useClass: NodeMailerSendEmailService,
    },
  ],
  exports: [SendEmail],
})
export class MailModule {}
