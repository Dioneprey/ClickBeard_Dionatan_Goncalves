import { Either, left, right } from 'src/core/either'
import { Injectable } from '@nestjs/common'
import { ResourceNotFoundError } from './@errors/resource-not-found.error'
import { ImageCouldNotBeSentError } from './@errors/image-cant-be-send.error'
import { Uploader } from '../storage/uploader'
import { SpecialityRepository } from '../repositories/speciality-repository'

interface UploadSpecialityImageUseCaseRequest {
  specialityId: string
  fileName: string
  fileType: string
  file: Buffer
}

type UploadSpecialityImageUseCaseResponse = Either<
  ResourceNotFoundError | ImageCouldNotBeSentError,
  {
    url: string
  }
>

@Injectable()
export class UploadSpecialityImageUseCase {
  constructor(
    private specialityRepository: SpecialityRepository,
    private uploader: Uploader,
  ) {}

  async execute({
    specialityId,
    fileName,
    fileType,
    file,
  }: UploadSpecialityImageUseCaseRequest): Promise<UploadSpecialityImageUseCaseResponse> {
    try {
      const specialityExists =
        await this.specialityRepository.findById(specialityId)

      if (!specialityExists) {
        return left(new ResourceNotFoundError(specialityId))
      }

      const { url } = await this.uploader.upload({ fileName, fileType, file })

      specialityExists.photo = url

      await this.specialityRepository.save(specialityExists)

      return right({
        url,
      })
    } catch (error) {
      console.log(error)
      return left(new ImageCouldNotBeSentError())
    }
  }
}
