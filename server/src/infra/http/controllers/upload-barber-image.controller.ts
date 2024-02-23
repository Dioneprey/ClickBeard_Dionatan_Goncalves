import {
  FileInterceptor,
  MemoryStorageFile,
  UploadedFile,
} from '@blazity/nest-file-fastify'
import {
  BadRequestException,
  Body,
  Controller,
  Post,
  UseInterceptors,
} from '@nestjs/common'
import { UploadBarberImageUseCase } from 'src/domain/barbershop/application/use-cases/upload-barber-image'
import { UserRole } from 'src/domain/barbershop/enterprise/entities/user'
import { Roles } from 'src/infra/auth/role.decorator'

@Controller('barbers/upload')
export class UploadBarberImageController {
  constructor(private uploadBarberImageUseCase: UploadBarberImageUseCase) {}

  @Post()
  @Roles(UserRole.ADMIN)
  @UseInterceptors(FileInterceptor('file'))
  async handle(
    @UploadedFile() file: MemoryStorageFile,
    @Body('fileName') fileName: string,
    @Body('barberId') barberId: string,
  ) {
    const { mimetype, buffer } = file

    const result = await this.uploadBarberImageUseCase.execute({
      barberId,
      file: buffer,
      fileName,
      fileType: mimetype,
    })

    if (result.isLeft()) {
      const error = result.value

      throw new BadRequestException(error.message)
    }
  }
}
