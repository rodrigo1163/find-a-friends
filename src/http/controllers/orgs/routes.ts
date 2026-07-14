import type { FastifyInstance } from 'fastify'
import { createOrgController } from './create-org-controller'
import { authenticateController } from './authenticate-controller'

export async function orgsRoutes(app: FastifyInstance) {
  app.post('/orgs', createOrgController)

  app.post('/sessions', authenticateController)
}
