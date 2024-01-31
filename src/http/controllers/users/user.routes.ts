import { FastifyInstance } from 'fastify'
/**
 * Ccntrollers
 */
import { authUserController } from './auth/auth-user.controller'
import { registerUserController } from './register-users.controller'
import { profileUserController } from './profile-user.controller'
import { getUserMetricsController } from './get-user-metrics.controller'
import { refreshUserTokenUserController } from './auth/refresh-user-token.controller'
/**
 * Middlewares
 */
import { verifyJWT } from '../../middlewares/verify-jwt.middleware'

export async function userRoutes(app: FastifyInstance) {
  app.post('/sessions', authUserController)
  app.post('/users', registerUserController)

  app.patch('/token/refresh', refreshUserTokenUserController)

  /**
   * Authenticated
   */
  app.get('/me', { onRequest: [verifyJWT] }, profileUserController)
  app.get(
    '/users/metrics',
    { onRequest: [verifyJWT] },
    getUserMetricsController,
  )
}
