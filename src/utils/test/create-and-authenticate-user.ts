import { User } from '@prisma/client'
import { FastifyInstance } from 'fastify'
import request from 'supertest'

export async function createAndAuthenticateUser(
  app: FastifyInstance,
  role?: 'ADMIN' | 'MEMBER',
): Promise<{
  token: string
  user: User
}> {
  const userCredentials = {
    email: 'johndoe@example.com',
    password: '12345678',
  }

  const craeteUserResponse = await request(app.server)
    .post('/users')
    .send({
      name: 'John Doe',
      role,
      ...userCredentials,
    })

  const { body } = await request(app.server)
    .post('/sessions')
    .send(userCredentials)

  const { token } = body

  return { token, user: craeteUserResponse.body.user }
}
