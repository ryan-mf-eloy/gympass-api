import { PrismaUsersRepository } from '@/repositories/prisma/prisma-users.repository'
import { HashLib } from '@/lib/Hash.lib'
import { AuthService } from '../auth/auth'

export function makeAuthServiceFactory() {
  const hashLib = new HashLib()
  const userRepository = new PrismaUsersRepository()
  const userRegisterService = new AuthService(userRepository, hashLib)

  return userRegisterService
}
