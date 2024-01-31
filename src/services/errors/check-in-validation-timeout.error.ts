export class CheckInValidationTimeoutError extends Error {
  constructor() {
    super('Check-in time is expired')
  }
}
