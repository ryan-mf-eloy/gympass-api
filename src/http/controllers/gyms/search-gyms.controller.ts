import { FastifyRequest, FastifyReply } from 'fastify'

import { z } from 'zod'
/**
 * Factories
 */
import { makeSearchGymsServiceFactory } from '@/services/factories/make-search-gyms-service.factory'

export async function searchGymController(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const searchGymQuerySchema = z.object({
    query: z.string(),
    page: z.coerce.number().min(1).default(1),
  })

  const { page, query } = searchGymQuerySchema.parse(request.query)

  const searchGymService = makeSearchGymsServiceFactory()

  const gyms = await searchGymService.execute({
    query,
    page,
  })

  return reply.status(200).send(gyms)
}
