import { Gym } from '@prisma/client'
/**
 * Repositories
 */
import { IGymsRepository } from '@/repositories/gyms.repository'

interface IFetchNearbyGymsServiceParams {
  userLongitude: number
  userLatitude: number
}

interface IFetchNearbyGymsServiceResponse {
  gyms: Gym[]
}

export class FetchNearbyGymsService {
  constructor(private gymsRepository: IGymsRepository) {}

  async execute({
    userLatitude,
    userLongitude,
  }: IFetchNearbyGymsServiceParams): Promise<IFetchNearbyGymsServiceResponse> {
    const gyms = await this.gymsRepository.findManyNearby({
      latitude: userLatitude,
      longitude: userLongitude,
    })

    return { gyms }
  }
}
