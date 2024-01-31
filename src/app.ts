/**
 * Server
 */
import fastify from 'fastify'
import fastifyJwt from '@fastify/jwt'
import fastifyCookie from '@fastify/cookie'
/**
 * Routes
 */
import { userRoutes } from './http/controllers/users/user.routes'
import { gymRoutes } from './http/controllers/gyms/gym.routes'
import { checkInsRoutes } from './http/controllers/check-ins/check-ins.routes'
/**
 * Zod
 */
import { ZodError } from 'zod'
import { env } from '@/env'

export const app = fastify()
/**
 * Auth
 */
app.register(fastifyJwt, {
  secret: env.JWT_SECRET,
  cookie: {
    cookieName: 'refreshToken',
    signed: false,
  },
  sign: {
    expiresIn: '7m',
  },
})
/**
 * Cookies
 */
app.register(fastifyCookie)
/**
 * Routes
 */
app.register(userRoutes)
app.register(gymRoutes)
app.register(checkInsRoutes)
/**
 * Global Error Handler
 */
app.setErrorHandler((error, _, reply) => {
  if (error instanceof ZodError)
    return reply
      .status(400)
      .send({ message: 'Validation error', issues: error.format() })

  return reply.status(500).send({ message: 'Internal Server Error' })
})
