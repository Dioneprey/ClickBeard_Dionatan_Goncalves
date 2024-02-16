import { Module } from '@nestjs/common'
import { DatabaseModule } from '../database/database.module'
import { AuthenticateController } from './controllers/authenticate.controller'
import { AuthenticateUseCase } from 'src/domain/barbershop/application/use-cases/authenticate'
import { CryptographyModule } from '../cryptography/cryptography.module'
import { RegisterUserController } from './controllers/register-user.controller'
import { RegisterUserUseCase } from 'src/domain/barbershop/application/use-cases/register-user'
import { HomeController } from './controllers/home.controller'

@Module({
  imports: [DatabaseModule, CryptographyModule],
  controllers: [HomeController, AuthenticateController, RegisterUserController],
  providers: [AuthenticateUseCase, RegisterUserUseCase],
})
export class HttpModule {}
