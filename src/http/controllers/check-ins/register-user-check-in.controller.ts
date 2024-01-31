import { FastifyRequest, FastifyReply } from 'fastify'

import { z } from 'zod'
/**
 * Factories
 */
import { makeRegisterUserCheckInServiceFactory } from '@/services/factories/make-register-user-check-in-service.factory'

export async function registerUserCheckInController(
  { body, params, user }: FastifyRequest,
  reply: FastifyReply,
) {
  const registerUserCheckInParamsSchema = z.object({
    gymId: z.string().uuid(),
  })

  const registerUserCheckInBodySchema = z.object({
    latitude: z.coerce.number().refine((value) => {
      return value >= -90 && value <= 90
    }),
    longitude: z.coerce.number().refine((value) => {
      return value >= -180 && value <= 180
    }),
  })

  const { latitude, longitude } = registerUserCheckInBodySchema.parse(body)
  const { gymId } = registerUserCheckInParamsSchema.parse(params)

  const registerUserCheckInService = makeRegisterUserCheckInServiceFactory()

  const gym = await registerUserCheckInService.execute({
    gymId,
    userId: user.sub,
    userLatitude: latitude,
    userLongitude: longitude,
  })

  return reply.status(201).send({ gym })
}
