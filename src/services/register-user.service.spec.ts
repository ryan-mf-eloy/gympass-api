import { it, expect, describe, beforeEach, vi } from 'vitest'

import { RegisterUserService } from './register-user.service'
import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users.repository'
import { UserAlreadyExistError } from './errors/user-already-exist.error'
import { HashLib } from '@/lib/Hash.lib'
import { UUIDLib } from '@/lib/UUIDLib'

let usersRepository: InMemoryUsersRepository
let hashLib: HashLib
let uuidLib: UUIDLib
let sut: RegisterUserService

describe('Register User Service', () => {
  beforeEach(() => {
    hashLib = new HashLib()
    uuidLib = new UUIDLib()
    usersRepository = new InMemoryUsersRepository(uuidLib)

    sut = new RegisterUserService(usersRepository, hashLib)
  })

  it('should be able create hash from user password', async () => {
    const userPassword = '12345678'
    await sut.execute({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: userPassword,
    })

    vi.spyOn(hashLib, 'compareHash').mockReturnValue(
      new Promise((resolve) => resolve(true)),
    )
    const isCorrectPasswordHash = await hashLib.compareHash(
      userPassword,
      'hash',
    )

    expect(isCorrectPasswordHash).toBe(true)
  })

  it('should not be able create a user with equal e-mail', async () => {
    const email = 'johndoe@example.com'

    await sut.execute({
      name: 'John Doe',
      email,
      password: '12345678',
    })

    const equalEmailRegister = sut.execute({
      name: 'John Doe',
      email,
      password: '12345678',
    })

    await expect(equalEmailRegister).rejects.toBeInstanceOf(
      UserAlreadyExistError,
    )
  })

  it('should be able create a user on database', async () => {
    const { id } = await sut.execute({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: '12345678',
    })

    expect(id).toEqual(expect.any(String))
  })
})
