import { prisma } from '@/lib/prisma'
import { Prisma, User } from '@prisma/client'

/**
 * Interafaces
 */
import { IUsersRepository } from '../users.repository'

export class PrismaUsersRepository implements IUsersRepository {
  async create(data: Prisma.UserCreateInput): Promise<User> {
    const createdUser = await prisma.user.create({ data })

    return createdUser
  }

  async findById(userId: string): Promise<User | null> {
    const foundUser = await prisma.user.findUnique({
      where: { id: userId },
    })

    return foundUser
  }

  async findByEmail(email: string): Promise<User | null> {
    const foundUser = await prisma.user.findUnique({ where: { email } })

    return foundUser
  }
}
