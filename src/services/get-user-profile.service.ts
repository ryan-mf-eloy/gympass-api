import { User } from '@prisma/client'
/**
 * Repositories
 */
import { IUsersRepository } from '@/repositories/users.repository'
/**
 * Error Handlers
 */
import { ResourceNotFoundError } from './errors/resource-not-found.error'

interface IGetUserProfileParams {
  userId: string
}

interface IGetUserProfileResponse {
  user: User
}

export class GetUserProfileService {
  constructor(private usersRepository: IUsersRepository) {}

  async execute({
    userId,
  }: IGetUserProfileParams): Promise<IGetUserProfileResponse> {
    const user = await this.usersRepository.findById(userId)

    if (!user) throw new ResourceNotFoundError()

    return { user }
  }
}
