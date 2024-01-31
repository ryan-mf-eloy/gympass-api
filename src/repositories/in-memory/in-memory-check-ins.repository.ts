import { CheckIn, Prisma } from '@prisma/client'
import { ICheckInsRepository } from '../check-ins.repository'

/**
 * Libraries
 */
import { UUIDLib } from '@/lib/UUIDLib'

export class InMemoryCheckInRepository implements ICheckInsRepository {
  public checkIns: CheckIn[] = []

  constructor(private uuidLib: UUIDLib) {}

  async create(data: Prisma.CheckInUncheckedCreateInput): Promise<CheckIn> {
    const checkIn = {
      ...data,
      id: this.uuidLib.gen(),
      created_at: new Date(),
      validated_at: data.validated_at ? new Date() : null,
    }

    this.checkIns.push(checkIn)

    return checkIn
  }

  async save(checkIn: CheckIn): Promise<CheckIn> {
    const checkInIndex = this.checkIns.findIndex(
      (item) => item.id === checkIn.id,
    )

    if (checkInIndex >= 0) this.checkIns[checkInIndex] = checkIn

    return checkIn
  }

  async countByUserId(userId: string): Promise<number> {
    return this.checkIns.filter((checkIn) => checkIn.user_id === userId).length
  }

  async findById(checkInId: string): Promise<CheckIn | null> {
    const checkIn = this.checkIns.find((checkIn) => checkIn.id === checkInId)

    if (!checkIn) return null

    return checkIn
  }

  async findManyByUserId(userId: string, page: number): Promise<CheckIn[]> {
    const foundCheckIns = this.checkIns
      .filter((checkIn) => checkIn.user_id === userId)
      .slice((page - 1) * 20, page * 20)

    return foundCheckIns
  }

  async findByUserIdOnDate(
    userId: string,
    date: Date,
  ): Promise<CheckIn | null> {
    const foundCheckIn = this.checkIns.find((checkIn) => {
      const isTheSameDate = checkIn.created_at.getDate() === date.getDate()
      const isTheSameUser = checkIn.user_id === userId
      return isTheSameDate && isTheSameUser
    })

    if (!foundCheckIn) return null

    return foundCheckIn
  }
}
