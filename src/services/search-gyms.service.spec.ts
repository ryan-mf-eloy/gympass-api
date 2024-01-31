import { it, expect, describe, beforeEach } from 'vitest'

import { UUIDLib } from '@/lib/UUIDLib'
import { SearchGymsService } from './search-gyms.service'
import { InMemoryGymsRepository } from '@/repositories/in-memory/in-memory-gyms.repository'

let gymsRepository: InMemoryGymsRepository
let uuidLib: UUIDLib
let sut: SearchGymsService

describe('Search Gyms Service', () => {
  beforeEach(() => {
    uuidLib = new UUIDLib()
    gymsRepository = new InMemoryGymsRepository(uuidLib)

    sut = new SearchGymsService(gymsRepository)
  })

  it('should be able return all results about query search param with pagination', async () => {
    await gymsRepository.create({
      title: 'Gym Name 1',
      description: 'Gym Description 1',
      phone: 'Gym Phone 1',
      latitude: 1,
      longitude: 1,
    })

    await gymsRepository.create({
      title: 'Gym Name 2',
      description: 'Gym Description 2',
      phone: 'Gym Phone 2',
      latitude: 1,
      longitude: 1,
    })

    const { gyms } = await sut.execute({ query: 'Gym', page: 1 })

    expect(gyms).toHaveLength(2)
    expect(gyms).toEqual([
      expect.objectContaining({ title: 'Gym Name 1' }),
      expect.objectContaining({ title: 'Gym Name 2' }),
    ])
  })
})
