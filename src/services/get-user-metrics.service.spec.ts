import { it, expect, describe, beforeEach } from 'vitest'

import { InMemoryCheckInRepository } from '@/repositories/in-memory/in-memory-check-ins.repository'
import { UUIDLib } from '@/lib/UUIDLib'
import { GetUserMetricsService } from './get-user-metrics.service'

let checkInsRepository: InMemoryCheckInRepository
let uuidLib: UUIDLib
let sut: GetUserMetricsService

describe('Get User Metrics Service', () => {
  beforeEach(() => {
    uuidLib = new UUIDLib()
    checkInsRepository = new InMemoryCheckInRepository(uuidLib)

    sut = new GetUserMetricsService(checkInsRepository)
  })

  it('should be able return specific user check-ins metrics', async () => {
    await checkInsRepository.create({
      gym_id: 'gym_id',
      user_id: 'user_id_1',
    })

    await checkInsRepository.create({
      gym_id: 'gym_id',
      user_id: 'user_id_1',
    })

    const { amount } = await sut.execute({ userId: 'user_id_1' })

    expect(amount).toEqual(2)
  })
})
