/**
 * Repositories
 */
import { IUsersRepository } from '@/repositories/users.repository'
/**
 * Libraries
 */
import { HashLib } from '@/lib/Hash.lib'
/**
 * Error Handlers
 */
import { InvalidCredentialsError } from '../errors/invalid-credentials.error'

interface IAuthParams {
  email: string
  password: string
}

interface IAuthResponse {
  user: {
    id: string
    role: string
  }
}

export class AuthService {
  constructor(
    private usersRepository: IUsersRepository,
    private hashLib: HashLib,
  ) {}

  async execute({ email, password }: IAuthParams): Promise<IAuthResponse> {
    const user = await this.usersRepository.findByEmail(email)

    if (!user) throw new InvalidCredentialsError()

    const isCorrectPassword = await this.hashLib.compareHash(
      password,
      user.password_hash,
    )

    if (!isCorrectPassword) throw new InvalidCredentialsError()

    return { user }
  }
}
