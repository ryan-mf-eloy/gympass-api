import { GetUserProfileService } from '../get-user-profile.service'
import { PrismaUsersRepository } from '@/repositories/prisma/prisma-users.repository'

export function makeGetUserProfileServiceFactory() {
  const usersRepository = new PrismaUsersRepository()
  const getUserProfileService = new GetUserProfileService(usersRepository)

  return getUserProfileService
}
