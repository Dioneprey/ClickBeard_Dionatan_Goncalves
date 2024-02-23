import { Either, left, right } from 'src/core/either'
import { Injectable } from '@nestjs/common'
import { ResourceNotFoundError } from './@errors/resource-not-found.error'
import { ImageCouldNotBeSentError } from './@errors/image-cant-be-send.error'
import { Uploader } from '../storage/uploader'
import { BarberRepository } from '../repositories/barber-repository'

interface UploadBarberImageUseCaseRequest {
  barberId: string
  fileName: string
  fileType: string
  file: Buffer
}

type UploadBarberImageUseCaseResponse = Either<
  ResourceNotFoundError | ImageCouldNotBeSentError,
  {
    url: string
  }
>

@Injectable()
export class UploadBarberImageUseCase {
  constructor(
    private barberRepository: BarberRepository,
    private uploader: Uploader,
  ) {}

  async execute({
    barberId,
    fileName,
    fileType,
    file,
  }: UploadBarberImageUseCaseRequest): Promise<UploadBarberImageUseCaseResponse> {
    try {
      const barberExists = await this.barberRepository.findById(barberId)

      if (!barberExists) {
        return left(new ResourceNotFoundError(barberId))
      }

      const { url } = await this.uploader.upload({ fileName, fileType, file })

      barberExists.photo = url

      await this.barberRepository.save(barberExists)

      return right({
        url,
      })
    } catch (error) {
      console.log(error)
      return left(new ImageCouldNotBeSentError())
    }
  }
}
