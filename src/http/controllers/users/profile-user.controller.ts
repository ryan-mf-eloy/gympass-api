import { FastifyRequest, FastifyReply } from 'fastify'
/**
 * Factories
 */
import { makeGetUserProfileServiceFactory } from '@/services/factories/make-get-user-profile-service.factory'
/**
 * Error Handlers
 */
import { ResourceNotFoundError } from '@/services/errors/resource-not-found.error'

export async function profileUserController(
  { user }: FastifyRequest,
  reply: FastifyReply,
) {
  try {
    const getUserProfileService = makeGetUserProfileServiceFactory()
    const userProfile = await getUserProfileService.execute({
      userId: user.sub,
    })

    return reply.status(200).send({ profile: userProfile })
  } catch (error) {
    if (error instanceof ResourceNotFoundError)
      return reply.status(400).send({ error })

    return reply.status(500).send()
  }
}
