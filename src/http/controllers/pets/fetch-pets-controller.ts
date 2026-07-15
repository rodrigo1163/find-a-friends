import { makeFetchPetsUseCase } from '@/use-cases/factories/make-fetch-pets-use-case'
import type { FastifyReply, FastifyRequest } from 'fastify'
import z from 'zod'

export async function fetchPetsController(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const fetchPetsQuerySchema = z.object({
    city: z.string(),
    type: z.enum(['DOG', 'CAT']).optional(),
    ageGroup: z.enum(['PUPPY', 'YOUNG', 'ADULT', 'SENIOR']).optional(),
    size: z.enum(['SMALL', 'MEDIUM', 'LARGE']).optional(),
    energyLevel: z.enum(['LOW', 'MEDIUM', 'HIGH']).optional(),
    independenceLevel: z.enum(['LOW', 'MEDIUM', 'HIGH']).optional(),
    environment: z.enum(['SMALL', 'MEDIUM', 'SPACIOUS']).optional(),
  })

  const {
    city,
    type,
    ageGroup,
    size,
    energyLevel,
    independenceLevel,
    environment,
  } = fetchPetsQuerySchema.parse(request.query)

  const fetchPetsUseCase = makeFetchPetsUseCase()

  const pets = await fetchPetsUseCase.execute({
    city,
    type,
    ageGroup,
    size,
    energyLevel,
    independenceLevel,
    environment,
  })

  return reply.status(200).send({
    pets,
  })
}
