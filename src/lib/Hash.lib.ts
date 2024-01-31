import { hash, compare } from 'bcryptjs'

export class HashLib {
  async createHash(str: string): Promise<string> {
    return hash(str, 6)
  }

  async compareHash(strToCompare: string, hash: string): Promise<boolean> {
    return compare(strToCompare, hash)
  }
}
