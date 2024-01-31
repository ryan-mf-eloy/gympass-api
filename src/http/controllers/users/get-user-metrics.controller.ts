import { FastifyRequest, FastifyReply } from 'fastify'

/**
 * Factories
 */
import { makeGetUserMetricsServiceFactory } from '@/services/factories/make-get-user-metrics-service.factory'

export async function getUserMetricsController(
  { user }: FastifyRequest,
  reply: FastifyReply,
) {
  const getUserMetricsService = makeGetUserMetricsServiceFactory()

  const { amount } = await getUserMetricsService.execute({
    userId: user.sub,
  })

  return reply.status(200).send({ amount })
}
