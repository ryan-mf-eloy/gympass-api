import { FastifyInstance } from 'fastify'
/**
 * Ccntrollers
 */
import { registerUserCheckInController } from './register-user-check-in.controller'
import { fetchUserCheckInsHistoryController } from './fetch-user-check-ins-history.controller'
import { validateUserCheckInController } from './validate-user-check-in.controller'
/**
 * Middlewares
 */
import { verifyJWT } from '../../middlewares/verify-jwt.middleware'
import { verifyUserRole } from '@/http/middlewares/verify-user-role.middleware'

export async function checkInsRoutes(app: FastifyInstance) {
  /**
   * Authenticated
   */
  app.addHook('onRequest', verifyJWT)

  app.post('/check-ins/:gymId', registerUserCheckInController)

  app.get('/check-ins/history/:userId', fetchUserCheckInsHistoryController)

  app.patch(
    '/check-ins/:checkInId/validate',
    { onRequest: [verifyUserRole('ADMIN')] },
    validateUserCheckInController,
  )
}
