import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3'
import { randomUUID } from 'crypto'
import { Injectable } from '@nestjs/common'
import { EnvService } from '../env/env.service'
import {
  UploadParams,
  Uploader,
} from 'src/domain/barbershop/application/storage/uploader'

@Injectable()
export class S3Storage implements Uploader {
  private client: S3Client
  private bucketEndPoint: string

  constructor(private envService: EnvService) {
    this.bucketEndPoint = envService.get('AWS_BUCKET_ENDPOINT')

    this.client = new S3Client({
      endpoint: this.bucketEndPoint,
      region: 'sa-east-1',
      credentials: {
        accessKeyId: envService.get('AWS_ACCESS_KEY_ID'),
        secretAccessKey: envService.get('AWS_SECRET_ACCESS_KEY_ID'),
      },
      forcePathStyle: true,
    })
  }

  async upload({ fileName, fileType, file }: UploadParams) {
    const uploadId = randomUUID()
    const uniqueFileName = `${uploadId}-${fileName}`

    await this.client.send(
      new PutObjectCommand({
        Bucket: this.envService.get('AWS_BUCKET_NAME'),
        Key: uniqueFileName,
        ContentType: fileType,
        Body: file,
      }),
    )

    return {
      url: `${this.bucketEndPoint}/click-beard/${uniqueFileName}`,
    }
  }
}
