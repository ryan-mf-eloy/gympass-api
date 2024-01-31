import { FastifyRequest, FastifyReply } from 'fastify'

import { z } from 'zod'
/**
 * Factories
 */
import { makeAuthServiceFactory } from '@/services/factories/make-auth-service.factory'
/**
 * Error Handlers
 */
import { InvalidCredentialsError } from '@/services/errors/invalid-credentials.error'

export async function authUserController(
  { body }: FastifyRequest,
  reply: FastifyReply,
) {
  try {
    const registerBodySchema = z.object({
      email: z.string().email(),
      password: z.string().min(6),
    })
    const userData = registerBodySchema.parse(body)

    const authService = makeAuthServiceFactory()
    const { user } = await authService.execute(userData)

    const token = await reply.jwtSign(
      { role: user.role },
      { sign: { sub: user.id } },
    )

    const refreshToken = await reply.jwtSign(
      { role: user.role },
      { sign: { sub: user.id, expiresIn: '7d' } },
    )

    return reply
      .status(200)
      .setCookie('refreshToken', refreshToken, {
        path: '/',
        secure: true,
        sameSite: true,
        httpOnly: true,
      })
      .send({ token })
  } catch (error) {
    if (error instanceof InvalidCredentialsError)
      return reply.status(401).send({ error })

    return reply.status(500).send()
  }
}
