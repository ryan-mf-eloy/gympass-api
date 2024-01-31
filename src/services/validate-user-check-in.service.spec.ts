import { it, expect, describe, beforeEach, afterEach, vi } from 'vitest'

import { ValidateUserCheckInService } from './validate-user-check-in.service'
import { InMemoryCheckInRepository } from '@/repositories/in-memory/in-memory-check-ins.repository'
import { ResourceNotFoundError } from './errors/resource-not-found.error'
import { CheckInValidationTimeoutError } from './errors/check-in-validation-timeout.error'
import { UUIDLib } from '@/lib/UUIDLib'

let checkInRepository: InMemoryCheckInRepository
let uuidLib: UUIDLib
let sut: ValidateUserCheckInService

describe('Validade User Check-In Service', () => {
  beforeEach(() => {
    uuidLib = new UUIDLib()
    checkInRepository = new InMemoryCheckInRepository(uuidLib)

    sut = new ValidateUserCheckInService(checkInRepository)

    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('should be able to validate user check-in', async () => {
    const createdCheckIn = await checkInRepository.create({
      gym_id: 'gym_id',
      user_id: 'user_id',
    })

    const { checkIn } = await sut.execute({
      checkInId: createdCheckIn.id,
    })

    expect(checkIn.validated_at).toEqual(expect.any(Date))
    expect(checkInRepository.checkIns[0].validated_at).toEqual(expect.any(Date))
  })

  it('should be able to return error if not exist check-in on database', async () => {
    await checkInRepository.create({
      gym_id: 'gym_id',
      user_id: 'user_id',
    })

    const checkIn = sut.execute({
      checkInId: 'not_found_check_in_id',
    })

    await expect(checkIn).rejects.toBeInstanceOf(ResourceNotFoundError)
  })

  it("should not be able to validate the check-in after valid time from it's creation", async () => {
    vi.setSystemTime(new Date(2024, 0, 1, 8)) // Jan 1, 2024, 8:00:00 AM

    const createdCheckIn = await checkInRepository.create({
      gym_id: 'gym_id',
      user_id: 'user_id',
    })

    vi.advanceTimersByTime(1000 * 60 * 21) // 21 Minutes

    const checkIn = sut.execute({
      checkInId: createdCheckIn.id,
    })

    await expect(checkIn).rejects.toBeInstanceOf(CheckInValidationTimeoutError)
  })
})
