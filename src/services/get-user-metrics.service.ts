/**
 * Repositories
 */
import { ICheckInsRepository } from '@/repositories/check-ins.repository'

interface IGetUserMetricsServiceParams {
  userId: string
}

interface IGetUserMetricsServiceResponse {
  amount: number
}

export class GetUserMetricsService {
  constructor(private checkInsRepository: ICheckInsRepository) {}

  async execute({
    userId,
  }: IGetUserMetricsServiceParams): Promise<IGetUserMetricsServiceResponse> {
    const amount = await this.checkInsRepository.countByUserId(userId)

    return { amount }
  }
}
