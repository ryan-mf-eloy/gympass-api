import { it, expect, describe, beforeEach } from 'vitest'

import { InMemoryCheckInRepository } from '@/repositories/in-memory/in-memory-check-ins.repository'
import { FetchUserCheckInsHistoryService } from './fetch-users-check-ins-history.service'
import { UUIDLib } from '@/lib/UUIDLib'

let checkInsRepository: InMemoryCheckInRepository
let uuidLib: UUIDLib
let sut: FetchUserCheckInsHistoryService

describe('Fetch Users Check Ins History Service', () => {
  beforeEach(() => {
    uuidLib = new UUIDLib()
    checkInsRepository = new InMemoryCheckInRepository(uuidLib)

    sut = new FetchUserCheckInsHistoryService(checkInsRepository)
  })

  it('should be able fetch and return all specific user check-ins history', async () => {
    await checkInsRepository.create({
      gym_id: 'gym_id',
      user_id: 'user_id_1',
    })

    await checkInsRepository.create({
      gym_id: 'gym_id',
      user_id: 'user_id_1',
    })

    const { checkIns } = await sut.execute({ userId: 'user_id_1', page: 1 })

    expect(checkIns).toHaveLength(2)
    expect(checkIns).toEqual([
      expect.objectContaining({ user_id: 'user_id_1' }),
      expect.objectContaining({ user_id: 'user_id_1' }),
    ])
  })

  it('should be able fetch and return all specific user check-ins using pagination', async () => {
    for (let i = 1; i <= 22; i++) {
      await checkInsRepository.create({
        gym_id: `gym_id_${i}`,
        user_id: 'user_id_1',
      })
    }

    const { checkIns } = await sut.execute({ userId: 'user_id_1', page: 2 })

    expect(checkIns).toHaveLength(2)
    expect(checkIns).toEqual([
      expect.objectContaining({ gym_id: 'gym_id_21' }),
      expect.objectContaining({ gym_id: 'gym_id_22' }),
    ])
  })
})
