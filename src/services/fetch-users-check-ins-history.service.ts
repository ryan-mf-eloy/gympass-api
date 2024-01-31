import { CheckIn } from '@prisma/client'
/**
 * Repositories
 */
import { ICheckInsRepository } from '@/repositories/check-ins.repository'

interface IFetchUserCheckInsHistoryParams {
  userId: string
  page: number
}

interface IFetchUserCheckInsHistoryResponse {
  checkIns: CheckIn[]
}

export class FetchUserCheckInsHistoryService {
  constructor(private checkInsRepository: ICheckInsRepository) {}

  async execute({
    userId,
    page,
  }: IFetchUserCheckInsHistoryParams): Promise<IFetchUserCheckInsHistoryResponse> {
    const checkIns = await this.checkInsRepository.findManyByUserId(
      userId,
      page,
    )

    return { checkIns }
  }
}
