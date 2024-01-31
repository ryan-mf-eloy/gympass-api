import { describe, it, expect, beforeAll, afterAll } from 'vitest'
import request from 'supertest'

import { app } from '@/app'
/**
 * Utils
 */
import { createAndAuthenticateUser } from '@/utils/test/create-and-authenticate-user'

describe('Fetch User Check-ins History Controller (e2e)', () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  it('should be able to return all user check-ins history', async () => {
    const { token, user } = await createAndAuthenticateUser(app, 'ADMIN')

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

    await request(app.server)
      .post(`/check-ins/${createGymResponse.body.gym.id}`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        latitude: -27.2092052,
        longitude: -49.6401091,
      })

    const { statusCode, body } = await request(app.server)
      .get(`/check-ins/history/${user.id}`)
      .set('Authorization', `Bearer ${token}`)
      .send()

    expect(statusCode).toEqual(200)
    expect(body.checkIns).toHaveLength(1)
    expect(body.checkIns).toEqual([
      expect.objectContaining({ user_id: user.id }),
    ])
  })
})
