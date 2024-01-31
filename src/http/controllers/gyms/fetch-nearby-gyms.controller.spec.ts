import { describe, it, expect, beforeAll, afterAll } from 'vitest'
import request from 'supertest'

import { app } from '@/app'
/**
 * Utils
 */
import { createAndAuthenticateUser } from '@/utils/test/create-and-authenticate-user'

describe('Fetch Nearby Gyms Controller (e2e)', () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  it.skip('should be able to return all gyms nearby from user', async () => {
    const { token } = await createAndAuthenticateUser(app, 'ADMIN')

    await request(app.server)
      .post('/gyms')
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: 'Near Gym',
        description: 'Some description',
        phone: '11999999999',
        latitude: -27.2092052,
        longitude: -49.6401091,
      })

    await request(app.server)
      .post('/gyms')
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: 'Far Gym',
        description: 'Some description',
        phone: '11999999999',
        latitude: -6.2092052,
        longitude: -6.6401091,
      })

    const { statusCode, body } = await request(app.server)
      .get('/gyms/nearby')
      .query({ longitude: -27.2092052, latitude: -49.6401091 })
      .set('Authorization', `Bearer ${token}`)
      .send()

    expect(body.gyms).toHaveLength(1)
    expect(body.gyms).toEqual([expect.objectContaining({ title: 'Near Gym' })])
    expect(statusCode).toEqual(200)
  })
})
