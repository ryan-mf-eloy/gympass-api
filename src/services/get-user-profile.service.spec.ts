import { it, expect, describe, beforeEach } from 'vitest'

import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users.repository'
import { GetUserProfileService } from './get-user-profile.service'
import { ResourceNotFoundError } from './errors/resource-not-found.error'
import { UUIDLib } from '@/lib/UUIDLib'

let usersRepository: InMemoryUsersRepository
let uuidLib: UUIDLib
let sut: GetUserProfileService

describe('Get User Profile', () => {
  beforeEach(() => {
    uuidLib = new UUIDLib()
    usersRepository = new InMemoryUsersRepository(uuidLib)

    sut = new GetUserProfileService(usersRepository)
  })

  it('should be able return specific user data by userId', async () => {
    const createdUser = await usersRepository.create({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password_hash: '12345678',
    })

    const { user } = await sut.execute({ userId: createdUser.id })

    expect(user.id).toEqual(createdUser.id)
  })

  it('shoul not be able return specific user data cause not found resource', async () => {
    await usersRepository.create({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password_hash: '12345678',
    })

    const result = sut.execute({ userId: 'not_found_id' })

    await expect(result).rejects.toBeInstanceOf(ResourceNotFoundError)
  })
})
