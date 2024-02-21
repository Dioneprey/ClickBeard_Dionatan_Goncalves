import { BullModule } from '@nestjs/bull'
import { Module, forwardRef } from '@nestjs/common'
import { EnvModule } from 'src/infra/env/env.module'
import { EnvService } from 'src/infra/env/env.service'
import { HandleAppointmentStatusProcessor } from './processor/appointment-processor'
import { DatabaseModule } from 'src/infra/database/database.module'
import { MailModule } from 'src/infra/mail/mail.module'
import { SseModule } from 'src/infra/events/sse-event.module'

@Module({
  imports: [
    forwardRef(() => DatabaseModule),
    SseModule,
    MailModule,
    BullModule.forRootAsync({
      imports: [EnvModule],
      inject: [EnvService],
      useFactory: async (envService: EnvService) => ({
        redis: {
          host: envService.get('REDIS_HOST'),
          port: envService.get('REDIS_PORT'),
        },
      }),
    }),
    BullModule.registerQueue({
      name: 'appointment-processor',
    }),
  ],
  providers: [HandleAppointmentStatusProcessor],
  exports: [BullModule],
})
export class BullConfigModule {}
