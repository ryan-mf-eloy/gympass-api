export class GymIsNotNearbyError extends Error {
  constructor() {
    super("The gym isn't nearby your region")
  }
}
