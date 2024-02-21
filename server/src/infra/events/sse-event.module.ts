import { Module } from '@nestjs/common'
import { SseService } from './sse-event.service'
import { SseEventController } from './event.controller'

@Module({
  providers: [SseService],
  controllers: [SseEventController],
})
export class SseModule {}
