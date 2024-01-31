import { CheckIn } from '@prisma/client'
/**
 * Repositories
 */
import { ICheckInsRepository } from '@/repositories/check-ins.repository'
import { IGymsRepository } from '@/repositories/gyms.repository'
/**
 * Error Handlers
 */
import { TwiceCheckInsOnDateError } from './errors/twice-check-ins-on-date.error'
import { ResourceNotFoundError } from './errors/resource-not-found.error'
import { GymIsNotNearbyError } from './errors/gym-not-is-nearby.error'
/**
 * Utils
 */
import { getDistanceBetweenCoordinates } from '@/utils/get-distance-between-coordinates.util'

interface IRegisterUserCheckInParams {
  userId: string
  gymId: string

  userLatitude: number
  userLongitude: number
}

interface IRegisterUserCheckInResponse {
  checkIn: CheckIn
}

export class RegisterUserCheckInService {
  constructor(
    private checkInsRepository: ICheckInsRepository,
    private gymsRepository: IGymsRepository,
  ) {}

  async execute({
    userId,
    gymId,
    userLatitude,
    userLongitude,
  }: IRegisterUserCheckInParams): Promise<IRegisterUserCheckInResponse> {
    const gym = await this.gymsRepository.findById(gymId)

    if (!gym) throw new ResourceNotFoundError()

    const distanceOfUserFromGym = getDistanceBetweenCoordinates(
      {
        latitude: userLatitude,
        longitude: userLongitude,
      },
      {
        latitude: gym.latitude.toNumber(),
        longitude: gym.longitude.toNumber(),
      },
    )

    const MAX_DISTANCE = 0.1 // 0.1km
    const gymIsNotNearby = distanceOfUserFromGym > MAX_DISTANCE

    if (gymIsNotNearby) throw new GymIsNotNearbyError()

    const alreadyExistThisUserCheckInOnDate =
      await this.checkInsRepository.findByUserIdOnDate(userId, new Date())

    if (alreadyExistThisUserCheckInOnDate) throw new TwiceCheckInsOnDateError()

    const checkIn = await this.checkInsRepository.create({
      gym_id: gymId,
      user_id: userId,
    })

    return { checkIn }
  }
}
