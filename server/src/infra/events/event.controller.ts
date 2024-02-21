import { Controller, Sse, Res, Req } from '@nestjs/common'
import { FastifyReply, FastifyRequest } from 'fastify'
import { SseService } from './sse-event.service'

@Controller('events/')
export class SseEventController {
  constructor(private readonly sseService: SseService) {}

  @Sse('subscribe')
  subscribe(@Req() req: FastifyRequest, @Res() res: FastifyReply) {
    res.raw.writeHead(200, {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      Connection: 'keep-alive',
    })

    const client = { res }
    this.sseService.addClient(client)

    res.raw.on('close', () => {
      this.sseService.removeClient(client)
    })
  }
}
