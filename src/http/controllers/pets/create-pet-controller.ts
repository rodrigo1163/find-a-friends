import { ResourceNotFoundError } from '@/use-cases/erros/resource-not-found-error'
import { makeCreatePetUseCase } from '@/use-cases/factories/make-create-pet-use-case'
import type { FastifyReply, FastifyRequest } from 'fastify'
import z from 'zod'

export async function createPetController(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const createPetBodySchema = z.object({
    name: z.string(),
    description: z.string(),
    type: z.enum(['DOG', 'CAT']),
    ageGroup: z.enum(['PUPPY', 'YOUNG', 'ADULT', 'SENIOR']),
    size: z.enum(['SMALL', 'MEDIUM', 'LARGE']),
    energyLevel: z.enum(['LOW', 'MEDIUM', 'HIGH']),
    independenceLevel: z.enum(['LOW', 'MEDIUM', 'HIGH']),
    environment: z.enum(['SMALL', 'MEDIUM', 'SPACIOUS']),
    adoptionRequirements: z.string(),
  })

  try {
    const {
      name,
      description,
      type,
      ageGroup,
      size,
      energyLevel,
      independenceLevel,
      environment,
      adoptionRequirements,
    } = createPetBodySchema.parse(request.body)

    const createPetUseCase = makeCreatePetUseCase()

    await createPetUseCase.execute({
      name,
      description,
      type,
      ageGroup,
      size,
      energyLevel,
      independenceLevel,
      environment,
      adoptionRequirements,
      org_id: request.user.sub,
    })

    return reply.status(201).send()
  } catch (error) {
    if (error instanceof ResourceNotFoundError) {
      return reply.status(404).send({
        message: error.message,
      })
    }

    throw error
  }
}
