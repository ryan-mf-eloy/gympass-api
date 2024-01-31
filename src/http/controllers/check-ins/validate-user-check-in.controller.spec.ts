import { describe, it, expect, beforeAll, afterAll } from 'vitest'
import request from 'supertest'

import { app } from '@/app'
/**
 * Utils
 */
import { createAndAuthenticateUser } from '@/utils/test/create-and-authenticate-user'

describe('Validate User Check-in Controller (e2e)', () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  it('should be able to validate a user check-in', async () => {
    const { token } = await createAndAuthenticateUser(app, 'ADMIN')

    const createGymResponse = await request(app.server)
      .post('/gyms')
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: 'JavaScript Gym',
        description: 'Some description',
        phone: '11999999999',
        latitude: -27.2092052,
        longitude: -49.6401091,
      })

    const createCheckInResponse = await request(app.server)
      .post(`/check-ins/${createGymResponse.body.gym.id}`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        latitude: -27.2092052,
        longitude: -49.6401091,
      })

    const { statusCode } = await request(app.server)
      .patch(`/check-ins/${createCheckInResponse.body.gym.checkIn.id}/validate`)
      .set('Authorization', `Bearer ${token}`)
      .send()

    expect(statusCode).toEqual(204)
  })
})
