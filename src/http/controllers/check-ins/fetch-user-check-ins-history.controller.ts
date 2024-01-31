import { FastifyRequest, FastifyReply } from 'fastify'

import { z } from 'zod'
/**
 * Factories
 */
import { makeFetchUsersCheckInsHistoryServiceFactory } from '@/services/factories/make-fetch-users-check-ins-history-service.factory'

export async function fetchUserCheckInsHistoryController(
  { query, user }: FastifyRequest,
  reply: FastifyReply,
) {
  const fetchUserCheckInsHistoryQuerySchema = z.object({
    page: z.coerce.number().min(1).default(1),
  })

  const { page } = fetchUserCheckInsHistoryQuerySchema.parse(query)

  const searchGymService = makeFetchUsersCheckInsHistoryServiceFactory()

  const { checkIns } = await searchGymService.execute({
    page,
    userId: user.sub,
  })

  return reply.status(200).send({ checkIns })
}
