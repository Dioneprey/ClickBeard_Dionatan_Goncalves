import { Controller, Sse, MessageEvent } from '@nestjs/common'
import { Public } from '../auth/public'
import { Observable, fromEvent, map } from 'rxjs'
import { EventEmitter2 } from '@nestjs/event-emitter'

@Controller('events/appointments')
export class AppointmentsSseEventController {
  constructor(private eventEmitter: EventEmitter2) {}

  @Public()
  @Sse('sse')
  subscribe(): Observable<MessageEvent> {
    return fromEvent(this.eventEmitter, 'change-appointment').pipe(
      map(() => {
        return { data: 'change-appointment' }
      }),
    )
  }
}
