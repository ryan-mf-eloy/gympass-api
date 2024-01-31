import { it, expect, describe, beforeEach } from 'vitest'

import { InMemoryGymsRepository } from '@/repositories/in-memory/in-memory-gyms.repository'
import { RegisterGymService } from './register-gym.service'
import { UUIDLib } from '@/lib/UUIDLib'

let gymsRepository: InMemoryGymsRepository
let uuidLib: UUIDLib
let sut: RegisterGymService

describe('Register Gym Service', () => {
  beforeEach(() => {
    uuidLib = new UUIDLib()
    gymsRepository = new InMemoryGymsRepository(uuidLib)

    sut = new RegisterGymService(gymsRepository)
  })

  it('should be able create a gym on database', async () => {
    const { gym } = await sut.execute({
      title: 'JavaScript Gym',
      description: 'JavaScript Gym',
      phone: '999999999',
      latitude: -23.5505199,
      longitude: -46.6333093,
    })

    expect(gym.id).toEqual(expect.any(String))
  })
})
