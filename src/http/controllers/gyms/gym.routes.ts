import { FastifyInstance } from 'fastify'
/**
 * Ccntrollers
 */
import { registerGymController } from './register-gym.controller'
import { fetchNearbyGymsController } from './fetch-nearby-gyms.controller'
import { searchGymController } from './search-gyms.controller'
/**
 * Middlewares
 */
import { verifyJWT } from '../../middlewares/verify-jwt.middleware'
import { verifyUserRole } from '@/http/middlewares/verify-user-role.middleware'

export async function gymRoutes(app: FastifyInstance) {
  /**
   * Authenticated
   */
  app.addHook('onRequest', verifyJWT)

  app.get('/gyms/search', searchGymController)
  app.get('/gyms/nearby', fetchNearbyGymsController)

  app.post(
    '/gyms',
    { onRequest: [verifyUserRole('ADMIN')] },
    registerGymController,
  )
}
