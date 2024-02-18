import { Module } from '@nestjs/common'
import { DatabaseModule } from '../database/database.module'
import { AuthenticateController } from './controllers/authenticate.controller'
import { AuthenticateUseCase } from 'src/domain/barbershop/application/use-cases/authenticate'
import { CryptographyModule } from '../cryptography/cryptography.module'
import { RegisterUserController } from './controllers/register-user.controller'
import { RegisterUserUseCase } from 'src/domain/barbershop/application/use-cases/register-user'
import { HomeController } from './controllers/home.controller'
import { GetUserProfileController } from './controllers/get-user-profile.controller'
import { GetUserProfileUseCase } from 'src/domain/barbershop/application/use-cases/get-user-profile'

@Module({
  imports: [DatabaseModule, CryptographyModule],
  controllers: [
    HomeController,
    AuthenticateController,
    RegisterUserController,
    GetUserProfileController,
  ],
  providers: [AuthenticateUseCase, RegisterUserUseCase, GetUserProfileUseCase],
})
export class HttpModule {}
