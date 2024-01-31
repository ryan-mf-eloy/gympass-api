import { Gym } from '@prisma/client'
/**
 * Repositories
 */
import { IGymsRepository } from '@/repositories/gyms.repository'

interface ISearchGymsServiceParams {
  query: string
  page: number
}

interface ISearchGymsServiceResponse {
  gyms: Gym[]
}

export class SearchGymsService {
  constructor(private gymsRepository: IGymsRepository) {}

  async execute({
    query,
    page,
  }: ISearchGymsServiceParams): Promise<ISearchGymsServiceResponse> {
    const gyms = await this.gymsRepository.searchMany(query, page)

    return { gyms }
  }
}
