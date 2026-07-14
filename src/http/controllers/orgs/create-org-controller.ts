import { OrgsAlreadyExistsError } from '@/use-cases/erros/orgs-already-exists-error'
import { makeCreateOrgsUseCase } from '@/use-cases/factories/make-create-orgs-use-case'
import type { FastifyReply, FastifyRequest } from 'fastify'
import z from 'zod'

export async function createOrgController(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const createOrgBodySchema = z.object({
    org: z.object({
      name: z.string(),
      email: z.email(),
      phone: z.string(),
      password: z.string(),
    }),
    addressOrg: z.object({
      cep: z.string(),
      street: z.string(),
      number: z.string(),
      neighborhood: z.string(),
      city: z.string(),
      state: z.string(),
      complement: z.string().nullable().optional(),
      reference: z.string().nullable().optional(),
      country: z.string().optional(),
      latitude: z.number().refine((value) => {
        return Math.abs(value) <= 90
      }),
      longitude: z.number().refine((value) => {
        return Math.abs(value) <= 180
      }),
    }),
  })

  try {
    const { org, addressOrg } = createOrgBodySchema.parse(request.body)

    const createOrgUseCase = makeCreateOrgsUseCase()

    await createOrgUseCase.execute({
      org,
      addressOrg,
    })

    return reply.status(201).send()
  } catch (error) {
    if (error instanceof OrgsAlreadyExistsError) {
      return reply.status(409).send({
        message: error.message,
      })
    }

    throw error
  }
}
