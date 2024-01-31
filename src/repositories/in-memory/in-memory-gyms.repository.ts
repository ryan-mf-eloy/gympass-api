import { Gym, Prisma } from '@prisma/client'
import { IFindManyNearbyParams, IGymsRepository } from '../gyms.repository'
/**
 * Libraries
 */
import { UUIDLib } from '@/lib/UUIDLib'
import { Decimal } from '@prisma/client/runtime/library'
/**
 * Utils
 */
import { getDistanceBetweenCoordinates } from '@/utils/get-distance-between-coordinates.util'

export class InMemoryGymsRepository implements IGymsRepository {
  public gyms: Gym[] = []

  constructor(private uuidLib: UUIDLib) {}

  async create(data: Prisma.GymCreateInput): Promise<Gym> {
    const gym = {
      id: this.uuidLib.gen(),
      title: data.title,
      description: data.description ?? null,
      phone: data.phone ?? null,
      latitude: new Decimal(data.latitude.toString()),
      longitude: new Decimal(data.longitude.toString()),
      created_at: new Date(),
    }

    this.gyms.push(gym)

    return gym
  }

  async findManyNearby(userCoordinates: IFindManyNearbyParams): Promise<Gym[]> {
    return this.gyms.filter((gym) => {
      const gymCoordinates = {
        latitude: gym.latitude.toNumber(),
        longitude: gym.longitude.toNumber(),
      }
      const distance = getDistanceBetweenCoordinates(
        userCoordinates,
        gymCoordinates,
      )

      const MAX_DISTANCE = 10 // 10km

      if (distance < MAX_DISTANCE) return gym

      return false
    })
  }

  async searchMany(query: string, page: number): Promise<Gym[]> {
    return this.gyms
      .filter(({ title }) => title.includes(query))
      .slice((page - 1) * 20, page * 20)
  }

  async findById(gymId: string): Promise<Gym | null> {
    const foundGym = this.gyms.find((gym) => gym.id === gymId)

    if (!foundGym) return null

    return foundGym
  }
}
