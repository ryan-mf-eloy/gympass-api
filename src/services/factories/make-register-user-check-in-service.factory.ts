import { PrismaCheckInsRepository } from '@/repositories/prisma/prisma-check-ins.repository'
import { RegisterUserCheckInService } from '../register-user-check-in.service'
import { PrismaGymsRepository } from '@/repositories/prisma/prisma-gyms.repository'

export function makeRegisterUserCheckInServiceFactory() {
  const checkInRepository = new PrismaCheckInsRepository()
  const gymsRepository = new PrismaGymsRepository()
  const userCheckInService = new RegisterUserCheckInService(
    checkInRepository,
    gymsRepository,
  )

  return userCheckInService
}
