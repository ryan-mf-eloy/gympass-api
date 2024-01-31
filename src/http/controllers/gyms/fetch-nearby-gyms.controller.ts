import { FastifyRequest, FastifyReply } from 'fastify'

import { z } from 'zod'
/**
 * Factories
 */
import { makeFetchNearbyGymsServiceFactory } from '@/services/factories/make-fetch-nearby-gyms-service.factory'

export async function fetchNearbyGymsController(
  { query }: FastifyRequest,
  reply: FastifyReply,
) {
  const fetchNearbyGymsQuerySchema = z.object({
    latitude: z.coerce.number().refine((value) => {
      return value >= -90 && value <= 90
    }),
    longitude: z.coerce.number().refine((value) => {
      return value >= -180 && value <= 180
    }),
  })

  const { latitude, longitude } = fetchNearbyGymsQuerySchema.parse(query)

  const fetchNearbyGymsService = makeFetchNearbyGymsServiceFactory()

  const gyms = await fetchNearbyGymsService.execute({
    userLatitude: latitude,
    userLongitude: longitude,
  })

  return reply.status(200).send(gyms)
}
