import { assertType, expectTypeOf, test } from "vitest"

import { COMMAND_ID } from "../commands/id"
import { defineFollowCommand } from "./command"

test("defineFollowCommand types", () => {
  assertType(
    defineFollowCommand({
      id: COMMAND_ID.entry.openInBrowser,
      label: "",
      run: (url) => {
        expectTypeOf(url).toEqualTypeOf<string>()
      },
    }),
  )

  assertType(
    defineFollowCommand({
      id: COMMAND_ID.entry.openInBrowser,
      label: "",
      // @ts-expect-error - redundant parameters
      run: (url, _b: number) => console.info(url),
    }),
  )

  assertType(
    defineFollowCommand({
      // @ts-expect-error - unknown id
      id: "unknown id",
      label: "",
      run: () => {},
    }),
  )

  assertType(
    defineFollowCommand({
      id: COMMAND_ID.entry.openInBrowser,
      label: "",
      // @ts-expect-error - invalid type
      run: (_n: number) => {},
    }),
  )
})
