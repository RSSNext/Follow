import type { ReactNode } from "react"

import type { CommandId } from "../commands/id"

export type CommandCategory =
  | "follow:settings"
  | "follow:layout"
  | "follow:updates"
  | "follow:help"
  | "follow:general"

export interface KeybindingOptions {
  binding: string
  capture?: boolean
  // some keybindings are already registered in other places
  // we can skip the registration of these keybindings __FOR NOW__
  skipRegister?: boolean
}

interface KeybindingCommandOptions {
  /**
   * a set of predefined precondition strategies.
   *
   * note: this only used for keybinding and command menu.
   * command will always available when called directly.
   */
  when?: boolean
  /**
   * we use https://github.com/jamiebuilds/tinykeys so that we can use the same keybinding definition
   * for both mac and windows.
   *
   * Use `$mod` for `Cmd` on Mac and `Ctrl` on Windows and Linux.
   */
  keyBinding?: KeybindingOptions | string
  /**
   * additional arguments for the command.
   *
   * Only used when the command is called from a keybinding.
   */
  // args?: Parameters<T>
}

export interface CommandOptions<T extends (...args: any[]) => unknown = (...args: any[]) => unknown>
  extends KeybindingCommandOptions {
  id: CommandId
  // main text on the left..
  // make text a function so that we can do i18n and interpolation when we need to
  label:
    | string
    | (() => string)
    | {
        title: string
        subTitle?: string
      }
    | (() => {
        title: string
        subTitle?: string
      })
  icon?: ReactNode
  category?: CommandCategory
  run: T
}

export interface Command<T extends (...args: any[]) => unknown = (...args: any[]) => unknown> {
  readonly id: string
  readonly label: {
    title: string
    subTitle?: string
  }
  readonly icon?: ReactNode
  readonly category: CommandCategory
  run: T

  readonly when: boolean
  readonly keyBinding?: KeybindingOptions
}

export type CommandContext = {
  feedId?: string
  entryId?: string
  listId?: string
}

export type ContextFn = (args: { context: CommandContext } & Record<string, unknown>) => void

export type FollowCommandOptions = CommandOptions<ContextFn>
export type FollowCommand = Command<ContextFn>

export function createCommand(options: CommandOptions): Command {
  return {
    id: options.id,
    run: options.run,
    icon: options.icon,
    category: options.category ?? "follow:general",
    get label() {
      let { label } = options
      label = typeof label === "function" ? label?.() : label
      label =
        typeof label === "string"
          ? {
              title: label,
            }
          : label
      return label
    },
    when: !!(options.when ?? true),
    keyBinding:
      typeof options.keyBinding === "string" ? { binding: options.keyBinding } : options.keyBinding,
  }
}
