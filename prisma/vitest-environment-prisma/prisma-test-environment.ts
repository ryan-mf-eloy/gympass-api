import 'dotenv/config'

import { UUIDLib } from '@/lib/UUIDLib'
import { Environment } from 'vitest'
import { execSync } from 'node:child_process'
import { PrismaClient } from '@prisma/client'

const prismaClient = new PrismaClient()

function generateDatabaseURL(schema: string) {
  const databaseURL = process.env.DATABASE_URL

  if (!databaseURL)
    throw new Error('Provide a DATABASE_URL environment variable.')

  const url = new URL(databaseURL)
  url.searchParams.set('schema', schema)

  return url.toString()
}

export default <Environment>{
  name: 'prisma',
  async setup(): Promise<{ teardown(): Promise<void> }> {
    const schema = new UUIDLib().gen()
    const databaseURL = generateDatabaseURL(schema)

    process.env.DATABASE_URL = databaseURL

    execSync('npx prisma migrate deploy')

    return {
      async teardown(): Promise<void> {
        await prismaClient.$executeRawUnsafe(
          `DROP SCHEMA IF EXISTS "${schema}" CASCADE`,
        )

        await prismaClient.$disconnect()
      },
    }
  },
  transformMode: 'ssr',
}
