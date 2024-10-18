import { describe, expect, test } from "vitest"

import { isBizId } from "./utils"

describe("utils", () => {
  test("isBizId", () => {
    expect(isBizId("1712546615000")).toBe(true)
    expect(isBizId("17125466150000")).toBe(true)
    expect(isBizId("171254661500000")).toBe(true)
    expect(isBizId("1712546615000000")).toBe(true)
    expect(isBizId("17125466150000000")).toBe(true)
    expect(isBizId("171254661500000000")).toBe(true)
    expect(isBizId("1712546615000000000")).toBe(true)
    expect(isBizId("9994780527253199722")).toBe(false)

    // sample biz id
    expect(isBizId("41147805272531997")).toBe(true)

    // test string
    expect(isBizId("ep 1712546615000")).toBe(false)
    expect(isBizId("又有人在微博提到 DIYgod 了")).toBe(false)

    // test short number
    expect(isBizId("123456789")).toBe(false)

    // test long number
    expect(isBizId("12345678901234567890")).toBe(false)
  })
})
