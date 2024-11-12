import { assertType, test } from "vitest"

import { COMMAND_ID } from "../commands/id"
import { useRegisterHotkey } from "./use-register-hotkey"

test("useRegisterHotkey types", () => {
  assertType(
    useRegisterHotkey({
      key: "",
      commandId: COMMAND_ID.entry.openInBrowser,
      args: [""],
    }),
  )

  assertType(
    useRegisterHotkey({
      key: "",
      commandId: COMMAND_ID.entry.openInBrowser,
      // @ts-expect-error - missing required options
      args: [],
    }),
  )

  assertType(
    useRegisterHotkey({
      key: "",
      commandId: COMMAND_ID.entry.openInBrowser,
      // @ts-expect-error - invalid args type
      args: [1],
    }),
  )

  assertType(
    useRegisterHotkey({
      key: "",
      commandId: COMMAND_ID.entry.openInBrowser,
      // @ts-expect-error - invalid args number
      args: ["", ""],
    }),
  )

  assertType(
    useRegisterHotkey({
      key: "",
      // @ts-expect-error - invalid command id
      commandId: "unknown command",
    }),
  )
})
