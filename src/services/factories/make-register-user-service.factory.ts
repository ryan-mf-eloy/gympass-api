import { PrismaUsersRepository } from '@/repositories/prisma/prisma-users.repository'
import { RegisterUserService } from '../register-user.service'
import { HashLib } from '@/lib/Hash.lib'

export function makeUserRegisterFactory() {
  const hashLib = new HashLib()
  const userRepository = new PrismaUsersRepository()
  const userRegisterService = new RegisterUserService(userRepository, hashLib)

  return userRegisterService
}
