import { PrismaCheckInsRepository } from '@/repositories/prisma/prisma-check-ins.repository'
import { ValidateUserCheckInService } from '../validate-user-check-in.service'

export function makeValidateUserCheckInServiceFactory() {
  const checkInRepository = new PrismaCheckInsRepository()
  const validateUserCheckInService = new ValidateUserCheckInService(
    checkInRepository,
  )

  return validateUserCheckInService
}
