import { ResourceNotFoundError } from '@/use-cases/erros/resource-not-found-error'
import { makeGetPetUseCase } from '@/use-cases/factories/make-get-pet-use-case'
import type { FastifyReply, FastifyRequest } from 'fastify'
import z from 'zod'

export async function getPetController(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  try {
    const getPetParamsSchema = z.object({
    id: z.uuid(),
  })

  const { id } = getPetParamsSchema.parse(request.params)

  const getPetUseCase = makeGetPetUseCase()

  const pet = await getPetUseCase.execute(id)

  return reply.status(200).send({
    pet,
  })
  } catch (error) {
    if (error instanceof ResourceNotFoundError) {
      return reply.status(404).send({
        message: error.message,
      })
    }

    throw error
  }
}
