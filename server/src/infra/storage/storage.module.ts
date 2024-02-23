import { Module } from '@nestjs/common'
import { S3Storage } from './s3-storage'
import { EnvModule } from 'src/infra/env/env.module'
import { Uploader } from 'src/domain/barbershop/application/storage/uploader'

@Module({
  imports: [EnvModule],
  providers: [
    {
      provide: Uploader,
      useClass: S3Storage,
    },
  ],
  exports: [Uploader],
})
export class StorageModule {}
