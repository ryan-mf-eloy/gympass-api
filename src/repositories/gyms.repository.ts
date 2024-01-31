import { Gym, Prisma } from '@prisma/client'

export interface IFindManyNearbyParams {
  latitude: number
  longitude: number
}

export interface IGymsRepository {
  create(data: Prisma.GymCreateInput): Promise<Gym>
  searchMany(query: string, page: number): Promise<Gym[]>
  findManyNearby(userCoordinates: IFindManyNearbyParams): Promise<Gym[]>
  findById(gymId: string): Promise<Gym | null>
}
