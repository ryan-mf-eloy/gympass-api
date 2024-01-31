import { describe, it, expect, beforeAll, afterAll } from 'vitest'
import request from 'supertest'

import { app } from '@/app'

describe('Refresh User Token Controller (e2e)', () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  it('should be able to generate a new token and refresh token for logged user', async () => {
    const userCredentials = {
      email: 'johndoe@example.com',
      password: '12345678',
    }

    await request(app.server)
      .post('/users')
      .send({
        name: 'John Doe',
        role: 'MEMBER',
        ...userCredentials,
      })

    const authResponse = await request(app.server)
      .post('/sessions')
      .send(userCredentials)

    const cookies = authResponse.get('Set-Cookie')

    const response = await request(app.server)
      .patch('/token/refresh')
      .set('Cookie', cookies)
      .send()

    expect(response.statusCode).toEqual(200)
    expect(response.get('Set-Cookie')).toEqual([
      expect.stringContaining('refreshToken='),
    ])
    expect(response.body.token).toEqual(expect.any(String))
    expect(response.body.token).toBeTruthy()
  })
})
