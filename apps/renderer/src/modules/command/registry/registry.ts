import { atom } from "jotai"

// import { createKeybindingsHandler } from "tinykeys"
import { jotaiStore } from "~/lib/jotai"

import type { Command, CommandOptions as CommandOptions } from "./command"
import { createCommand } from "./command"

type KeyBindingMap = Record<string, (event: KeyboardEvent) => void>

export interface KeyBindingOptions {
  /**
   * Key presses will listen to this event (default: "keydown").
   */
  event?: "keydown" | "keyup"

  /**
   * Whether to capture the event during the capture phase (default: false).
   */
  capture?: boolean

  /**
   * Keybinding sequences will wait this long between key presses before
   * cancelling (default: 1000).
   *
   * **Note:** Setting this value too low (i.e. `300`) will be too fast for many
   * of your users.
   */
  timeout?: number
}

const bindKeys = (
  target: Window | HTMLElement,
  keyBindingMap: KeyBindingMap,
  _options: KeyBindingOptions = {},
) => {
  // const event = options.event ?? "keydown"
  // const onKeyEvent = createKeybindingsHandler(keyBindingMap, options)
  // target.addEventListener(event, onKeyEvent, options.capture)
  return () => {
    // target.removeEventListener(event, onKeyEvent, options.capture)
  }
}

export const CommandRegistry = new (class {
  readonly atom = atom<Record<string, Command>>({})

  get commands() {
    return {
      get: (id: string) => jotaiStore.get(this.atom)[id],
      set: (id: string, value: Command) =>
        jotaiStore.set(this.atom, (prev) => ({ ...prev, [id]: value })),
      has: (id: string) => !!jotaiStore.get(this.atom)[id],
      delete: (id: string) =>
        jotaiStore.set(this.atom, (prev) => {
          const next = { ...prev }
          delete next[id]
          return next
        }),
      values: () => Object.values(jotaiStore.get(this.atom)) as Command[],
    }
  }

  register(options: CommandOptions) {
    if (this.commands.has(options.id)) {
      console.warn(`Command ${options.id} already registered.`)
      return () => {}
    }
    const command = createCommand(options)
    this.commands.set(command.id, command)

    let unsubscribeKeyboardShortcut: (() => void) | undefined

    if (command.keyBinding && !command.keyBinding.skipRegister && typeof window !== "undefined") {
      const { binding: keybinding, capture } = command.keyBinding
      unsubscribeKeyboardShortcut = bindKeys(
        window,
        {
          [keybinding]: (e: Event) => {
            if (!command.when) return
            e.preventDefault()
            command.run()
          },
        },
        {
          capture,
        },
      )
    }

    return () => {
      unsubscribeKeyboardShortcut?.()
      this.commands.delete(command.id)
    }
  }

  has(id: string): boolean {
    return this.commands.has(id)
  }

  get(id: string): Command | undefined {
    if (!this.commands.has(id)) {
      console.warn(`Command ${id} not registered.`)
      return undefined
    }
    return this.commands.get(id)
  }

  getAll(): Command[] {
    return Array.from(this.commands.values())
  }

  run(id: string, ...args: unknown[]) {
    const command = this.get(id)
    if (!command) return

    command.run(args)
  }
})()

export function registerCommand(options: CommandOptions) {
  return CommandRegistry.register(options)
}
