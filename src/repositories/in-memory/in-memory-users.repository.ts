import { Prisma, User } from '@prisma/client'
import { IUsersRepository } from '../users.repository'

/**
 * Libraries
 */
import { UUIDLib } from '@/lib/UUIDLib'

export class InMemoryUsersRepository implements IUsersRepository {
  public users: User[] = []

  constructor(private uuidLib: UUIDLib) {}

  async findByEmail(email: string): Promise<User | null> {
    const user = this.users.find((user) => user.email === email)

    if (!user) return null

    return user
  }

  async findById(userId: string): Promise<User | null> {
    const user = this.users.find((user) => user.id === userId)

    if (!user) return null

    return user
  }

  async create(data: Prisma.UserCreateInput): Promise<User> {
    const user = {
      ...data,
      id: this.uuidLib.gen(),
      created_at: new Date(),
    }

    this.users.push(user)

    return user
  }
}
