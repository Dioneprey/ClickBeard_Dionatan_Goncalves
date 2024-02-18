import {
  BadRequestException,
  Controller,
  Get,
  NotFoundException,
} from '@nestjs/common'
import { ResourceNotFoundError } from 'src/domain/barbershop/application/use-cases/@errors/resource-not-found.error'
import { GetUserProfileUseCase } from 'src/domain/barbershop/application/use-cases/get-user-profile'
import { CurrentUser } from 'src/infra/auth/current-user.decorator'
import { UserPayload } from 'src/infra/auth/jwt.strategy'
import { UserPresenter } from '../presenters/user-presenter'

@Controller('/accounts')
export class GetUserProfileController {
  constructor(private getUserProfile: GetUserProfileUseCase) {}

  @Get()
  async handle(@CurrentUser() user: UserPayload) {
    const userId = user.sub

    const result = await this.getUserProfile.execute({
      userId,
    })

    if (result.isLeft()) {
      const error = result.value

      switch (error.constructor) {
        case ResourceNotFoundError:
          throw new NotFoundException(error.message)
        default:
          throw new BadRequestException(error.message)
      }
    }

    const userProfile = result.value.userProfile

    return {
      user: UserPresenter.toHTTP(userProfile),
    }
  }
}
