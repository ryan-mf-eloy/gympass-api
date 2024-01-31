import { prisma } from '@/lib/prisma'
import { Prisma, CheckIn } from '@prisma/client'

import { ICheckInsRepository } from '../check-ins.repository'

export class PrismaCheckInsRepository implements ICheckInsRepository {
  async create(data: Prisma.CheckInUncheckedCreateInput): Promise<CheckIn> {
    return prisma.checkIn.create({ data })
  }

  async save(checkIn: CheckIn): Promise<CheckIn> {
    return prisma.checkIn.update({ where: { id: checkIn.id }, data: checkIn })
  }

  async countByUserId(userId: string): Promise<number> {
    return prisma.checkIn.count({ where: { user_id: userId } })
  }

  async findById(checkInId: string): Promise<CheckIn | null> {
    return prisma.checkIn.findUnique({ where: { id: checkInId } })
  }

  async findByUserIdOnDate(
    userId: string,
    date: Date,
  ): Promise<CheckIn | null> {
    const startOfTheDay = new Date(
      date.getFullYear(),
      date.getMonth(),
      date.getDate(),
    )
    const endOfTheDay = new Date(
      date.getFullYear(),
      date.getMonth(),
      date.getDate() + 1,
    )

    return prisma.checkIn.findFirst({
      where: {
        user_id: userId,
        created_at: {
          gte: startOfTheDay,
          lte: endOfTheDay,
        },
      },
    })
  }

  async findManyByUserId(userId: string, page: number): Promise<CheckIn[]> {
    return prisma.checkIn.findMany({
      where: { user_id: userId },
      take: 20,
      skip: (page - 1) * 20,
    })
  }
}
