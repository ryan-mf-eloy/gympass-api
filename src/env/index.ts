import 'dotenv/config'
import { z } from 'zod'

const envSchema = z.object({
  // SERVER
  NODE_ENV: z.enum(['local', 'test', 'production']).default('local'),
  PORT: z.coerce.number().default(3333),

  // AUTH
  JWT_SECRET: z.string(),

  // DATABASE
  DATABASE_URL: z.string(),
})

const _env = envSchema.safeParse(process.env)

if (_env.success === false) {
  console.error('❌ Invalid environment variables', _env.error.format())

  throw new Error('Invalid environment variables.')
}

export const env = _env.data
