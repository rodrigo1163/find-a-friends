import { Pool } from 'pg'
import { PrismaPg } from '@prisma/adapter-pg'
import { env } from '@/env'
import { PrismaClient } from '../prisma/generated/prisma/client'
function createPrismaClient() {
  const connectionString = process.env.DATABASE_URL ?? env.DATABASE_URL
  const schema =
    new URL(connectionString).searchParams.get('schema') ?? 'public'
  const pool = new Pool({
    connectionString,
    // define o search_path já no handshake da conexão
    options: `-c search_path="${schema}",public`,
  })
  const adapter = new PrismaPg(pool, { schema })
  return new PrismaClient({
    adapter,
    log: env.NODE_ENV === 'dev' ? ['query'] : [],
  })
}
export const prisma = createPrismaClient()