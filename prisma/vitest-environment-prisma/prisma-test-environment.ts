import 'dotenv/config'
import { execSync } from 'node:child_process'
import { randomUUID } from 'node:crypto'
import { Client } from 'pg'
import type { Environment } from 'vitest/runtime'

function generateDatabaseUrl(schema: string) {
  const currentDatabaseUrl = process.env.DATABASE_URL

  if (!currentDatabaseUrl) {
    throw new Error('Please provide a DATABASE_URL env variable')
  }

  const url = new URL(currentDatabaseUrl)

  url.searchParams.set('schema', schema)

  return url.toString()
}

function generateCleanupDatabaseUrl(databaseUrl: string) {
  const url = new URL(databaseUrl)

  // O parâmetro schema é utilizado pelo Prisma.
  // Para a conexão administrativa de limpeza, ele não é necessário.
  url.searchParams.delete('schema')

  return url.toString()
}

export default <Environment>{
  name: 'prisma',
  viteEnvironment: 'ssr',

  async setup() {
    const originalDatabaseUrl = process.env.DATABASE_URL
    const schema = randomUUID()
    const databaseUrl = generateDatabaseUrl(schema)

    process.env.DATABASE_URL = databaseUrl

    execSync('pnpm prisma db push')

    return {
      async teardown() {
        const client = new Client({
          connectionString: generateCleanupDatabaseUrl(databaseUrl),
          connectionTimeoutMillis: 5_000,
          application_name: 'vitest-schema-cleanup',
        })

        try {
          await client.connect()

          // Impede o teardown de ficar travado indefinidamente.
          await client.query(`SET lock_timeout = '5s'`)
          await client.query(`SET statement_timeout = '10s'`)

          await client.query(
            `DROP SCHEMA IF EXISTS "${schema}" CASCADE`,
          )

        } finally {
          await client.end()

          if (originalDatabaseUrl) {
            process.env.DATABASE_URL = originalDatabaseUrl
          } else {
            delete process.env.DATABASE_URL
          }
        }
      },
    }
  },
}