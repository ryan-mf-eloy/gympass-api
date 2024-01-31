import { FastifyRequest, FastifyReply } from 'fastify'

import { z } from 'zod'
/**
 * Factories
 */
import { makeUserRegisterFactory } from '@/services/factories/make-register-user-service.factory'
/**
 * Error Handlers
 */
import { UserAlreadyExistError } from '@/services/errors/user-already-exist.error'

export async function registerUserController(
  { body }: FastifyRequest,
  reply: FastifyReply,
) {
  try {
    const registerBodySchema = z.object({
      name: z.string(),
      email: z.string().email(),
      role: z.enum(['ADMIN', 'MEMBER']).nullable(),
      password: z.string().min(6),
    })

    const userData = registerBodySchema.parse(body)

    const registerUserService = makeUserRegisterFactory()

    const user = await registerUserService.execute(userData)

    return reply.status(201).send({ user })
  } catch (error) {
    if (error instanceof UserAlreadyExistError)
      return reply.status(409).send({ error })

    return reply.status(500).send()
  }
}
