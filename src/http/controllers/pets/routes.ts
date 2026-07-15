import type { FastifyInstance } from 'fastify'
import { verifyJwt } from '@/http/middlewares/verify-jwt'
import { createPetController } from './create-pet-controller'
import { fetchPetsController } from './fetch-pets-controller'
import { getPetController } from './get-pet-controller'

export async function petsRoutes(app: FastifyInstance) {
  app.get('/pets', fetchPetsController)
  app.get('/pets/:id', getPetController)

  app.post('/pets', { onRequest: [verifyJwt] }, createPetController)
}
