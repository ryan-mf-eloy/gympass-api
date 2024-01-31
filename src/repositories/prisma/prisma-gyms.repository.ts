import { Prisma, Gym } from '@prisma/client'
import { prisma } from '@/lib/prisma'

import { IFindManyNearbyParams, IGymsRepository } from '../gyms.repository'

export class PrismaGymsRepository implements IGymsRepository {
  async create(data: Prisma.GymCreateInput): Promise<Gym> {
    return prisma.gym.create({ data })
  }

  async findById(gymId: string): Promise<Gym | null> {
    return prisma.gym.findUnique({ where: { id: gymId } })
  }

  async findManyNearby({
    latitude,
    longitude,
  }: IFindManyNearbyParams): Promise<Gym[]> {
    return await prisma.$queryRaw<Gym[]>`
      SELECT * from gyms
      WHERE ( 6371 * acos( cos( radians(${latitude}) ) * cos( radians( latitude ) ) * cos( radians( longitude ) - radians(${longitude}) ) + sin( radians(${latitude}) ) * sin( radians( latitude ) ) ) ) <= 10`
  }

  async searchMany(query: string, page: number): Promise<Gym[]> {
    return prisma.gym.findMany({
      where: {
        title: {
          contains: query,
        },
      },
      take: 20,
      skip: (page - 1) * 20,
    })
  }
}
