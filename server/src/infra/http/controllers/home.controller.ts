import { Controller, Get } from '@nestjs/common'

@Controller('/')
export class HomeController {
  @Get()
  async handle() {
    return 'ClickBeard'
  }
}
