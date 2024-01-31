import { FastifyRequest, FastifyReply } from 'fastify'

/**
 * Error Handlers
 */
import { InvalidCredentialsError } from '@/services/errors/invalid-credentials.error'

export async function refreshUserTokenUserController(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  try {
    await request.jwtVerify({ onlyCookie: true })

    const { role } = request.user

    const token = await reply.jwtSign(
      { role },
      { sign: { sub: request.user.sub } },
    )

    const refreshToken = await reply.jwtSign(
      { role },
      { sign: { sub: request.user.sub, expiresIn: '7d' } },
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
