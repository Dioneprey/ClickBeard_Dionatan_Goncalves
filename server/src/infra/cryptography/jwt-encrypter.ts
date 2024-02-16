import { Injectable } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Encrypter } from 'src/domain/barbershop/application/cryptography/encrypter'

@Injectable()
export class JwtEncrypter implements Encrypter {
  constructor(private jwtService: JwtService) {}

  encrypt(payload: Record<string, unknown>) {
    return this.jwtService.signAsync(payload, {
      expiresIn: '3d', // 3 dias
    })
  }
}
