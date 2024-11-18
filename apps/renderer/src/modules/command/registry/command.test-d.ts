import { assertType, expectTypeOf, test } from "vitest"

import { COMMAND_ID } from "../commands/id"
import { defineCommandArgsArray, defineFollowCommand, defineFollowCommandArgs } from "./command"

test("defineFollowCommand types", () => {
  assertType(
    defineFollowCommand({
      id: COMMAND_ID.entry.openInBrowser,
      label: "",
      run: (data) => {
        expectTypeOf(data).toEqualTypeOf<{
          entryId: string
        }>()
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

test("defineFollowCommand with keyBinding types", () => {
  assertType(
    defineFollowCommand({
      id: COMMAND_ID.entry.viewEntryContent,
      label: "",
      when: true,
      keyBinding: "",
      run: () => {},
    }),
  )

  assertType(
    defineFollowCommand({
      id: COMMAND_ID.entry.viewSourceContent,
      label: "",
      when: true,
      // @ts-expect-error - only simple command can set keybinding
      keyBinding: "",
      run: ({ entryId }) => {
        expectTypeOf(entryId).toEqualTypeOf<string>()
      },
    }),
  )
})

test("defineCommandArgs with keyBinding types", () => {
  assertType(
    defineFollowCommandArgs({
      commandId: COMMAND_ID.entry.star,
      args: [{ entryId: "1" }],
    }),
  )

  assertType(
    defineFollowCommandArgs({
      commandId: COMMAND_ID.entry.star,
      // @ts-expect-error - invalid args
      args: [],
    }),
  )
})

test("defineCommandArgsArray with keyBinding types", () => {
  assertType(
    defineCommandArgsArray([
      {
        commandId: COMMAND_ID.entry.star,
        args: [{ entryId: "1" }],
      },
    ]),
  )

  assertType(
    defineCommandArgsArray([
      {
        commandId: COMMAND_ID.entry.star,
        // @ts-expect-error - invalid args
        args: [],
      },
    ]),
  )

  assertType(
    defineCommandArgsArray([
      {
        commandId: COMMAND_ID.entry.star,
        // @ts-expect-error - invalid args
        args: [],
      },
      {
        commandId: COMMAND_ID.entry.viewEntryContent,
        args: [],
      },
    ]),
  )

  assertType(
    defineCommandArgsArray<{ test: boolean }>([
      {
        commandId: COMMAND_ID.entry.star,
        args: [{ entryId: "1" }],
        test: true,
      },
      {
        commandId: COMMAND_ID.entry.viewEntryContent,
        args: [],
        // @ts-expect-error - invalid extra property
        test: 1,
      },
    ]),
  )
})
