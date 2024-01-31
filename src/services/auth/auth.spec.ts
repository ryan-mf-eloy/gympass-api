import { describe, it, expect, vi, beforeEach } from 'vitest'

import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users.repository'
import { AuthService } from './auth'
import { HashLib } from '@/lib/Hash.lib'
import { InvalidCredentialsError } from '../errors/invalid-credentials.error'
import { UUIDLib } from '@/lib/UUIDLib'

let usersRepository: InMemoryUsersRepository
let hashLib: HashLib
let uuidLib: UUIDLib
let sut: AuthService

describe('Auth Service', () => {
  beforeEach(() => {
    hashLib = new HashLib()
    uuidLib = new UUIDLib()
    usersRepository = new InMemoryUsersRepository(uuidLib)

    sut = new AuthService(usersRepository, hashLib)
  })

  it('should be able authenticate a user using correct credentials', async () => {
    vi.spyOn(hashLib, 'createHash').mockReturnValue(
      new Promise((resolve) => resolve('mocked_password_hash')),
    )
    const mockedPasswordHash = await hashLib.createHash('')
    const { id } = await usersRepository.create({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password_hash: mockedPasswordHash,
    })

    vi.spyOn(hashLib, 'compareHash').mockReturnValue(
      new Promise((resolve) => resolve(true)),
    )

    const userCredentials = {
      email: 'johndoe@example.com',
      password: '12345678',
    }
    const { user } = await sut.execute(userCredentials)

    expect(user.id).toEqual(id)
  })

  it('should not be able authenticate a user using incorrect password', async () => {
    vi.spyOn(hashLib, 'createHash').mockReturnValue(
      new Promise((resolve) => resolve('mocked_password_hash')),
    )
    const mockedPasswordHash = await hashLib.createHash('')
    await usersRepository.create({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password_hash: mockedPasswordHash,
    })

    vi.spyOn(hashLib, 'compareHash').mockReturnValue(
      new Promise((resolve) => resolve(false)),
    )

    const auth = sut.execute({
      email: 'johndoe@example.com',
      password: '12345678',
    })

    await expect(auth).rejects.toBeInstanceOf(InvalidCredentialsError)
  })

  it('should not be able authenticate a user using incorrect e-mail', async () => {
    vi.spyOn(hashLib, 'createHash').mockReturnValue(
      new Promise((resolve) => resolve('mocked_password_hash')),
    )
    const mockedPasswordHash = await hashLib.createHash('')
    await usersRepository.create({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password_hash: mockedPasswordHash,
    })

    vi.spyOn(hashLib, 'compareHash').mockReturnValue(
      new Promise((resolve) => resolve(true)),
    )

    const auth = sut.execute({
      email: 'incorrect.email@example.com',
      password: '12345678',
    })

    await expect(auth).rejects.toBeInstanceOf(InvalidCredentialsError)
  })
})
