export class Chain {
  private chain: Promise<void> = Promise.resolve()

  next(fn: () => any | Promise<any>) {
    this.chain = this.chain.then(() => {
      return fn() || Promise.resolve()
    })
  }
}
