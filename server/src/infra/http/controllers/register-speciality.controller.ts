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

const registerSpecialityBodySchema = z.object({
  name: z.string(),
  price: z.number(),
  time: z.string(),
  photo: z.string().optional(),
})

type RegisterSpecialityBodySchema = z.infer<typeof registerSpecialityBodySchema>
const bodyValidationPipe = new ZodValidationPipe(registerSpecialityBodySchema)

@Controller('/specialities')
export class RegisterSpecialityController {
  constructor(private readonly registerSpeciality: RegisterSpecialityUseCase) {}

  @Post()
  async handle(
    @CurrentUser() user: UserPayload,
    @Body(bodyValidationPipe) body: RegisterSpecialityBodySchema,
  ) {
    const userId = user.sub

    const { name, price, time, photo } =
      registerSpecialityBodySchema.parse(body)

    const result = await this.registerSpeciality.execute({
      userId,
      specialityData: {
        name,
        price,
        time,
        photo,
      },
    })

    if (result.isLeft()) {
      const error = result.value

      switch (error.constructor) {
        case ForbbidenActionError:
          throw new ForbiddenException(error.message)
        default:
          throw new BadRequestException(error.message)
      }
    }
  }
}
