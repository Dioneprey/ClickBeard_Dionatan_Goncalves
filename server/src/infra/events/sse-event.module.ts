import { Module } from '@nestjs/common'

import { AppointmentsSseEventController } from './appointments-sse-event.controller'
import { SSEService } from './sse-service'
import { EventEmitterModule } from '@nestjs/event-emitter'

@Module({
  imports: [EventEmitterModule.forRoot()],
  controllers: [AppointmentsSseEventController],
  providers: [SSEService],
  exports: [SSEService],
})
export class EventsModule {}
