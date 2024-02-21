import { Injectable } from '@nestjs/common'
import { FastifyReply } from 'fastify'

interface SseClient {
  res: FastifyReply
}

@Injectable()
export class SseService {
  private clients = new Set<SseClient>()

  addClient(client: SseClient) {
    this.clients.add(client)
  }

  removeClient(client: SseClient) {
    this.clients.delete(client)
  }

  sendToAll(message: string) {
    this.clients.forEach((client) => {
      client.res.raw.write(`data: ${message}\n\n`)
    })
  }
}
