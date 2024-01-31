import { CheckIn } from '@prisma/client'
/**
 * Repositories
 */
import { ICheckInsRepository } from '@/repositories/check-ins.repository'
/**
 * Error Handlers
 */
import { ResourceNotFoundError } from './errors/resource-not-found.error'
import { CheckInValidationTimeoutError } from './errors/check-in-validation-timeout.error'

interface IValidateUserCheckInParams {
  checkInId: string
}

interface IValidateUserCheckInResponse {
  checkIn: CheckIn
}

export class ValidateUserCheckInService {
  constructor(private checkInsRepository: ICheckInsRepository) {}

  async execute({
    checkInId,
  }: IValidateUserCheckInParams): Promise<IValidateUserCheckInResponse> {
    const checkIn = await this.checkInsRepository.findById(checkInId)

    if (!checkIn) throw new ResourceNotFoundError()

    const validationTimeGap = Date.now() - checkIn.created_at.getTime()
    const validTimeToValidate = 1000 * 60 * 20 // 20 Minutes

    const isExpiredTime = validationTimeGap > validTimeToValidate

    if (isExpiredTime) throw new CheckInValidationTimeoutError()

    checkIn.validated_at = new Date()
    await this.checkInsRepository.save(checkIn)

    return { checkIn }
  }
}
