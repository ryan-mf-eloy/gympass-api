import { describe, it, expect, beforeAll, afterAll } from 'vitest'
import request from 'supertest'

import { app } from '@/app'

describe('Auth User Controller (e2e)', () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  it('should be able a user authenticate in the app', async () => {
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

    const { body, statusCode } = await request(app.server)
      .post('/sessions')
      .send(userCredentials)

    expect(statusCode).toEqual(200)
    expect(body.token).toEqual(expect.any(String))
    expect(body.token).toBeTruthy()
  })
})
