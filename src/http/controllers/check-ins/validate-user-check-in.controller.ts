import { FastifyRequest, FastifyReply } from 'fastify'

import { z } from 'zod'
/**
 * Factories
 */
import { makeValidateUserCheckInServiceFactory } from '@/services/factories/make-validate-user-check-in-service.factory'
/**
 * Error Handlers
 */
import { ResourceNotFoundError } from '@/services/errors/resource-not-found.error'
import { CheckInValidationTimeoutError } from '@/services/errors/check-in-validation-timeout.error'

export async function validateUserCheckInController(
  { params }: FastifyRequest,
  reply: FastifyReply,
) {
  try {
    const validateUserCheckInParamsSchema = z.object({
      checkInId: z.string().uuid(),
    })

    const { checkInId } = validateUserCheckInParamsSchema.parse(params)

    const validateUserCheckInService = makeValidateUserCheckInServiceFactory()

    await validateUserCheckInService.execute({
      checkInId,
    })

    return reply.status(204).send()
  } catch (error) {
    if (error instanceof CheckInValidationTimeoutError)
      return reply.status(400).send({ error })

    if (error instanceof ResourceNotFoundError)
      return reply.status(400).send({ error })

    return reply.status(500).send()
  }
}
