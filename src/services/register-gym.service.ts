import { Gym } from '@prisma/client'
/**
 * Repositories
 */
import { IGymsRepository } from '@/repositories/gyms.repository'

interface IRegisterGymServiceParams {
  title: string
  phone: string | null
  description: string | null
  latitude: number
  longitude: number
}

interface IRegisterGymServiceResponse {
  gym: Gym
}

export class RegisterGymService {
  constructor(private gymsRepository: IGymsRepository) {}

  async execute({
    latitude,
    longitude,
    title,
    description,
    phone,
  }: IRegisterGymServiceParams): Promise<IRegisterGymServiceResponse> {
    const gym = await this.gymsRepository.create({
      latitude,
      longitude,
      title,
      description,
      phone,
    })

    return { gym }
  }
}
