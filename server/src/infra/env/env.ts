import { z } from 'zod'

export const envSchema = z.object({
  NODE_ENV: z.enum(['dev', 'production', 'test']).optional().default('dev'),
  DATABASE_URL: z.string(),
  JWT_SECRET: z.string(),
  PORT: z.coerce.number().optional().default(3333),
})

export type Env = z.infer<typeof envSchema>
