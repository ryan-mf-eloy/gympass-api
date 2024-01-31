import { PrismaCheckInsRepository } from '@/repositories/prisma/prisma-check-ins.repository'
import { FetchUserCheckInsHistoryService } from '../fetch-users-check-ins-history.service'

export function makeFetchUsersCheckInsHistoryServiceFactory() {
  const checkInsRepository = new PrismaCheckInsRepository()
  const fetchUserCheckInsHistoryService = new FetchUserCheckInsHistoryService(
    checkInsRepository,
  )

  return fetchUserCheckInsHistoryService
}
