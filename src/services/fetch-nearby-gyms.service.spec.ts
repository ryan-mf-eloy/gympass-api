import { it, expect, describe, beforeEach } from 'vitest'

import { InMemoryGymsRepository } from '@/repositories/in-memory/in-memory-gyms.repository'
import { FetchNearbyGymsService } from './fetch-nearby-gyms.service'
import { UUIDLib } from '@/lib/UUIDLib'

let gymsRepository: InMemoryGymsRepository
let uuidLib: UUIDLib
let sut: FetchNearbyGymsService

describe('Fetch Nearby Gyms Service', () => {
  beforeEach(() => {
    uuidLib = new UUIDLib()
    gymsRepository = new InMemoryGymsRepository(uuidLib)

    sut = new FetchNearbyGymsService(gymsRepository)
  })

  it('should be able return all nearby gyms of specific user', async () => {
    await gymsRepository.create({
      title: 'Near Gym',
      description: 'Gym Description 1',
      phone: 'Gym Phone 1',
      latitude: -23.5505199,
      longitude: -46.6333093,
    })

    await gymsRepository.create({
      title: 'Far Gym',
      description: 'Gym Description 2',
      phone: 'Gym Phone 2',
      latitude: -5.5505199,
      longitude: -5.6333093,
    })

    const { gyms } = await sut.execute({
      userLatitude: -23.5505199,
      userLongitude: -46.6333093,
    })

    expect(gyms).toHaveLength(1)
    expect(gyms).toEqual([expect.objectContaining({ title: 'Near Gym' })])
  })
})
