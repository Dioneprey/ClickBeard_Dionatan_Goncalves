import { z } from 'zod'
import { ZodValidationPipe } from '../pipes/zod-validation.pipe'
import {
  BadRequestException,
  Body,
  Controller,
  ForbiddenException,
  Post,
} from '@nestjs/common'
import { CurrentUser } from 'src/infra/auth/current-user.decorator'
import { UserPayload } from 'src/infra/auth/jwt.strategy'
import { RegisterSpecialityUseCase } from 'src/domain/barbershop/application/use-cases/register-speciality'
import { ForbbidenActionError } from 'src/domain/barbershop/application/use-cases/@errors/forbbiden-action.error'
import { Roles } from 'src/infra/auth/role.decorator'
import { UserRole } from 'src/domain/barbershop/enterprise/entities/user'

const registerSpecialityBodySchema = z.object({
  name: z.string(),
  price: z.number(),
  photo: z.string().optional(),
})

type RegisterSpecialityBodySchema = z.infer<typeof registerSpecialityBodySchema>
const bodyValidationPipe = new ZodValidationPipe(registerSpecialityBodySchema)

@Controller('/specialities')
export class RegisterSpecialityController {
  constructor(private readonly registerSpeciality: RegisterSpecialityUseCase) {}

  @Post()
  @Roles(UserRole.ADMIN)
  async handle(
    @CurrentUser() user: UserPayload,
    @Body(bodyValidationPipe) body: RegisterSpecialityBodySchema,
  ) {
    const userId = user.sub

    const { name, price, photo } = registerSpecialityBodySchema.parse(body)

    const result = await this.registerSpeciality.execute({
      userId,
      specialityData: {
        name,
        price,
        photo,
      },
    })

    if (result.isLeft()) {
      const error = result.value
      console.log(error)

      switch (error.constructor) {
        case ForbbidenActionError:
          throw new ForbiddenException(error.message)
        default:
          throw new BadRequestException(error.message)
      }
    }

    const speciality = result.value.speciality

    return {
      specialityId: speciality.id.toString(),
    }
  }
}
