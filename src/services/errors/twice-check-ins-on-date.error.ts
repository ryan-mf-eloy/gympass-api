export class TwiceCheckInsOnDateError extends Error {
  constructor() {
    super('You cannot check-ins twice on the same day')
  }
}
