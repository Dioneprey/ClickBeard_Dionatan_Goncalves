import { Injectable } from '@nestjs/common'
import { PassportStrategy } from '@nestjs/passport'
import { ExtractJwt, Strategy } from 'passport-jwt'
import { z } from 'zod'
import { EnvService } from '../env/env.service'
import { PrismaService } from '../database/prisma/prisma.service'
import { UserRole } from 'src/domain/barbershop/enterprise/entities/user'

const tokenPayload = z.object({
  sub: z.string().uuid(),
  role: z.nativeEnum(UserRole),
  iat: z.number(),
  exp: z.number(),
})

export type UserPayload = z.infer<typeof tokenPayload>

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    config: EnvService,
    private prisma: PrismaService,
  ) {
    const jwtSecret = config.get('JWT_SECRET')

    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: jwtSecret,
      algorithms: ['HS256'],
    })
  }

  async validate(payload: UserPayload) {
    const user = await this.prisma.user.findUnique({
      where: {
        id: payload.sub,
      },
    })

    if (!user) {
      return false
    }

    return tokenPayload.parse(payload)
  }
}
