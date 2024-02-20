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
import { FetchBarbersController } from './controllers/fetch-barbers.controller'
import { FetchBarbersUseCase } from 'src/domain/barbershop/application/use-cases/fetch-barbers'
import { FetchAllSpecialitiesController } from './controllers/fetch-all-specialities.controller'
import { FetchAllSpecialitiesUseCase } from 'src/domain/barbershop/application/use-cases/fetch-all-specialities'
import { RegisterBarberController } from './controllers/register-barber.controller'
import { RegisterBarberUseCase } from 'src/domain/barbershop/application/use-cases/register-barber'
import { FetchBarberAvailableSlotsController } from './controllers/fetch-barber-available-slots.controller'
import { FetchBarberAvailableSlotsUseCase } from 'src/domain/barbershop/application/use-cases/fetch-barber-available-slots'
import { RegisterSpecialityController } from './controllers/register-speciality.controller'
import { RegisterSpecialityUseCase } from 'src/domain/barbershop/application/use-cases/register-speciality'
import { MakeAppointmentController } from './controllers/make-appointment.controller'
import { MakeAppointmentUseCase } from 'src/domain/barbershop/application/use-cases/make-appointment'

@Module({
  imports: [DatabaseModule, CryptographyModule],
  controllers: [
    HomeController,
    AuthenticateController,
    RegisterUserController,
    GetUserProfileController,
    FetchBarbersController,
    FetchAllSpecialitiesController,
    RegisterBarberController,
    FetchBarberAvailableSlotsController,
    RegisterSpecialityController,
    MakeAppointmentController,
  ],
  providers: [
    AuthenticateUseCase,
    RegisterUserUseCase,
    GetUserProfileUseCase,
    FetchBarbersUseCase,
    FetchAllSpecialitiesUseCase,
    RegisterBarberUseCase,
    FetchBarberAvailableSlotsUseCase,
    RegisterSpecialityUseCase,
    MakeAppointmentUseCase,
  ],
})
export class HttpModule {}
