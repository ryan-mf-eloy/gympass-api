import { FastifyRequest, FastifyReply } from 'fastify'

import { z } from 'zod'
/**
 * Factories
 */
import { makeRegisterGymServiceFactory } from '@/services/factories/make-register-gym-service.factory'

export async function registerGymController(
  { body }: FastifyRequest,
  reply: FastifyReply,
) {
  const registerBodySchema = z.object({
    title: z.string(),
    phone: z.string().nullable(),
    description: z.string().nullable(),

    latitude: z.coerce.number().refine((value) => {
      return value >= -90 && value <= 90
    }),
    longitude: z.coerce.number().refine((value) => {
      return value >= -180 && value <= 180
    }),
  })

  const gymData = registerBodySchema.parse(body)

  const registerGymService = makeRegisterGymServiceFactory()

  const createdGym = await registerGymService.execute(gymData)

  return reply.status(201).send(createdGym)
}
