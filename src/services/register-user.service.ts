/**
 * Interfaces
 */
import { IUsersRepository } from '@/repositories/users.repository'
/**
 * Error Handlers
 */
import { UserAlreadyExistError } from './errors/user-already-exist.error'
/**
 * Libs
 */
import { HashLib } from '@/lib/Hash.lib'

interface IUserServiceParamsData {
  name: string
  email: string
  password: string
  role: 'ADMIN' | 'MEMBER' | null
}

export class RegisterUserService {
  constructor(
    private usersRepository: IUsersRepository,
    private hashLib: HashLib,
  ) {}

  async execute(userData: IUserServiceParamsData) {
    const password_hash = await this.hashLib.createHash(userData.password)

    const userWithSameEmail = await this.usersRepository.findByEmail(
      userData.email,
    )
    if (userWithSameEmail) throw new UserAlreadyExistError()

    const { created_at, email, id, name, role } =
      await this.usersRepository.create({
        name: userData.name,
        email: userData.email,
        role: userData?.role ?? 'MEMBER',
        password_hash,
      })

    return { created_at, email, id, name, role }
  }
}
