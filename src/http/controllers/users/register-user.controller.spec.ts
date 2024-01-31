import { describe, it, expect, beforeAll, afterAll } from 'vitest'
import request from 'supertest'

import { app } from '@/app'

describe('Register User Controller (e2e)', () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  it('should be able a user register themselves in the app', async () => {
    const { statusCode } = await request(app.server).post('/users').send({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: '12345678',
      role: 'MEMBER',
    })

    expect(statusCode).toEqual(201)
  })
})
