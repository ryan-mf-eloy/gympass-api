import { PrismaGymsRepository } from '@/repositories/prisma/prisma-gyms.repository'
import { RegisterGymService } from '../register-gym.service'

export function makeRegisterGymServiceFactory() {
  const gymsRepository = new PrismaGymsRepository()
  const registerGymService = new RegisterGymService(gymsRepository)

  return registerGymService
}
