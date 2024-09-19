import { sleep } from "./utils"

export class Chain {
  private chain: Promise<void> = Promise.resolve()

  next(fn: () => any | Promise<any>) {
    this.chain = this.chain.then(() => {
      return fn() || Promise.resolve()
    })
  }

  wait(ms: number): this {
    this.chain = this.chain.then(() => sleep(ms))
    return this
  }
}
