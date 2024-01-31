import { describe, it, expect, beforeAll, afterAll } from 'vitest'
import request from 'supertest'

import { app } from '@/app'

/**
 * Utils
 */
import { createAndAuthenticateUser } from '@/utils/test/create-and-authenticate-user'

describe('Get User Profile Controller (e2e)', () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  it('should be able a user get themselve profile data', async () => {
    const { token } = await createAndAuthenticateUser(app, 'ADMIN')

    const { body, statusCode } = await request(app.server)
      .get('/me')
      .set('Authorization', `Bearer ${token}`)
      .send()

    expect(statusCode).toEqual(200)
    expect(body.profile.user).toEqual(
      expect.objectContaining({ email: 'johndoe@example.com' }),
    )
  })
})
