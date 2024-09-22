export class Yielder {
  private startTime: number

  constructor() {
    this.startTime = performance.now()
  }

  shouldYield(): boolean {
    return performance.now() - this.startTime > 16
  }

  async yield() {
    this.startTime = performance.now()
    return new Promise((resolve) => setTimeout(resolve, 0))
  }
}
