import { randomUUID } from 'node:crypto'

export class UUIDLib {
  gen(): string {
    return randomUUID()
  }
}
