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
import { UploadSpecialityImageUseCase } from 'src/domain/barbershop/application/use-cases/upload-speciality-image'
import { UserRole } from 'src/domain/barbershop/enterprise/entities/user'
import { Roles } from 'src/infra/auth/role.decorator'

@Controller('specialities/upload')
export class UploadSpecialityImageController {
  constructor(
    private uploadSpecialityImageUseCase: UploadSpecialityImageUseCase,
  ) {}

  @Post()
  @Roles(UserRole.ADMIN)
  @UseInterceptors(FileInterceptor('file'))
  async handle(
    @UploadedFile() file: MemoryStorageFile,
    @Body('fileName') fileName: string,
    @Body('specialityId') specialityId: string,
  ) {
    const { mimetype, buffer } = file

    const result = await this.uploadSpecialityImageUseCase.execute({
      specialityId,
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
