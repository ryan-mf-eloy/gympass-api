import { it, expect, describe, beforeEach, vi, afterEach } from 'vitest'

import { InMemoryCheckInRepository } from '@/repositories/in-memory/in-memory-check-ins.repository'
import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users.repository'
import { RegisterUserCheckInService } from './register-user-check-in.service'
import { UUIDLib } from '@/lib/UUIDLib'
import { TwiceCheckInsOnDateError } from './errors/twice-check-ins-on-date.error'
import { InMemoryGymsRepository } from '@/repositories/in-memory/in-memory-gyms.repository'
import { ResourceNotFoundError } from './errors/resource-not-found.error'
import { Decimal } from '@prisma/client/runtime/library'
import { GymIsNotNearbyError } from './errors/gym-not-is-nearby.error'

let checkInsRepository: InMemoryCheckInRepository
let usersRepository: InMemoryUsersRepository
let gymsRepository: InMemoryGymsRepository
let uuidLib: UUIDLib
let sut: RegisterUserCheckInService

describe('Register User Check In Service', () => {
  beforeEach(() => {
    uuidLib = new UUIDLib()
    checkInsRepository = new InMemoryCheckInRepository(uuidLib)
    usersRepository = new InMemoryUsersRepository(uuidLib)
    gymsRepository = new InMemoryGymsRepository(uuidLib)

    sut = new RegisterUserCheckInService(checkInsRepository, gymsRepository)

    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('should be able create a user check-in on database', async () => {
    const createdUser = await usersRepository.create({
      name: 'John Doe',
      email: 'john.doe@example.com',
      password_hash: '12345678',
    })

    const createdGym = await gymsRepository.create({
      title: 'JavaScript Gym',
      description: 'test_decription',
      phone: 'test_phone_number',
      latitude: new Decimal(-23.5505199),
      longitude: new Decimal(-46.6333093),
    })

    const { checkIn } = await sut.execute({
      userId: createdUser.id,
      gymId: createdGym.id,
      userLatitude: -23.5505199,
      userLongitude: -46.6333093,
    })

    expect(checkIn.id).toBeTruthy()
    expect(checkIn.id).toEqual(expect.any(String))
  })

  it('should not be able create user check-in twice on the same day', async () => {
    vi.setSystemTime(new Date(2024, 0, 20, 8, 0, 0))

    const createdUser = await usersRepository.create({
      name: 'John Doe',
      email: 'john.doe@example.com',
      password_hash: '12345678',
    })

    const createdGym = await gymsRepository.create({
      title: 'JavaScript Gym',
      description: 'test_decription',
      phone: 'test_phone_number',
      latitude: new Decimal(-23.5505199),
      longitude: new Decimal(-46.6333093),
    })

    await sut.execute({
      userId: createdUser.id,
      gymId: createdGym.id,
      userLatitude: -23.5505199,
      userLongitude: -46.6333093,
    })

    const secondCheckIn = sut.execute({
      userId: createdUser.id,
      gymId: createdGym.id,
      userLatitude: -23.5505199,
      userLongitude: -46.6333093,
    })

    await expect(secondCheckIn).rejects.toBeInstanceOf(TwiceCheckInsOnDateError)
  })

  it('should be able create many user check-ins in different days', async () => {
    vi.setSystemTime(new Date(2024, 0, 20, 8, 0, 0))

    const createdUser = await usersRepository.create({
      name: 'John Doe',
      email: 'john.doe@example.com',
      password_hash: '12345678',
    })

    const createdGym = await gymsRepository.create({
      title: 'JavaScript Gym',
      description: 'test_decription',
      phone: 'test_phone_number',
      latitude: new Decimal(-23.5505199),
      longitude: new Decimal(-46.6333093),
    })

    await sut.execute({
      userId: createdUser.id,
      gymId: createdGym.id,
      userLatitude: -23.5505199,
      userLongitude: -46.6333093,
    })

    vi.setSystemTime(new Date(2024, 0, 25, 8, 0, 0))

    const secondCheckIn = await sut.execute({
      userId: createdUser.id,
      gymId: createdGym.id,
      userLatitude: -23.5505199,
      userLongitude: -46.6333093,
    })

    expect(secondCheckIn.checkIn.id).toBeTruthy()
    expect(secondCheckIn.checkIn.id).toEqual(expect.any(String))
  })

  it('should not be able create user check-in cause not found gym on database', async () => {
    const createdUser = await usersRepository.create({
      name: 'John Doe',
      email: 'john.doe@example.com',
      password_hash: '12345678',
    })

    const checkIn = sut.execute({
      userId: createdUser.id,
      gymId: 'not_found_gym_id',
      userLatitude: -23.5505199,
      userLongitude: -46.6333093,
    })

    await expect(checkIn).rejects.toBeInstanceOf(ResourceNotFoundError)
  })

  it("should not be able create a user check-in cause the gym isn't nearby", async () => {
    const createdUser = await usersRepository.create({
      name: 'John Doe',
      email: 'john.doe@example.com',
      password_hash: '12345678',
    })

    const createdGym = await gymsRepository.create({
      title: 'JavaScript Gym',
      description: 'test_decription',
      phone: 'test_phone_number',
      latitude: new Decimal(-73.5505199),
      longitude: new Decimal(-16.6333093),
    })

    const checkIn = sut.execute({
      userId: createdUser.id,
      gymId: createdGym.id,
      userLatitude: -23.5505199,
      userLongitude: -46.6333093,
    })

    await expect(checkIn).rejects.toBeInstanceOf(GymIsNotNearbyError)
  })
})
