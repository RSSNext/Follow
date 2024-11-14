import { assertType, expectTypeOf, test } from "vitest"

import { COMMAND_ID } from "../commands/id"
import type { TipCommand } from "../commands/types"
import { useCommand, useGetCommand } from "./use-command"

test("useGetCommand types work properly", () => {
  const getCmd = useGetCommand()
  expectTypeOf(getCmd).toBeFunction()
  expectTypeOf(getCmd(COMMAND_ID.entry.tip)).toMatchTypeOf<TipCommand | null>()

  // @ts-expect-error - get an unknown command should throw an error
  assertType(getCmd("unknown command"))
})

test("useCommand types work properly", () => {
  const tipCmd = useCommand(COMMAND_ID.entry.tip)
  expectTypeOf(tipCmd).toMatchTypeOf<TipCommand | null>()

  // @ts-expect-error - get an unknown command should throw an error
  assertType(useCommand("unknown command"))
})
