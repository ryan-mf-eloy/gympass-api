import { FetchNearbyGymsService } from '../fetch-nearby-gyms.service'
import { PrismaGymsRepository } from '@/repositories/prisma/prisma-gyms.repository'

export function makeFetchNearbyGymsServiceFactory() {
  const gymsRepository = new PrismaGymsRepository()
  const fetchNearbyGymsService = new FetchNearbyGymsService(gymsRepository)

  return fetchNearbyGymsService
}
