// Entry commands

import type { Command } from "../types"
import type { COMMAND_ID } from "./id"

export type TipCommand = Command<{
  id: typeof COMMAND_ID.entry.tip
  fn: ({ userId, feedId, entryId }: { userId?: string; feedId?: string; entryId?: string }) => void
}>
export type OpenInBrowserCommand = Command<{
  id: typeof COMMAND_ID.entry.openInBrowser
  fn: (url: string) => void
}>

// Integration commands

export type SaveToEagleCommand = Command<{
  id: typeof COMMAND_ID.integration.saveToEagle
  fn: (payload: { entryId: string }) => void
}>

export type SaveToReadwiseCommand = Command<{
  id: typeof COMMAND_ID.integration.saveToReadwise
  fn: (payload: { entryId: string }) => void
}>

export type SaveToInstapaperCommand = Command<{
  id: typeof COMMAND_ID.integration.saveToInstapaper
  fn: (payload: { entryId: string }) => void
}>

export type SaveToOmnivoreCommand = Command<{
  id: typeof COMMAND_ID.integration.saveToOmnivore
  fn: (payload: { entryId: string }) => void
}>

export type SaveToObsidianCommand = Command<{
  id: typeof COMMAND_ID.integration.saveToObsidian
  fn: (payload: { entryId: string }) => void
}>

export type SaveToOutlineCommand = Command<{
  id: typeof COMMAND_ID.integration.saveToOutline
  fn: (payload: { entryId: string }) => void
}>

export type IntegrationCommand =
  | SaveToEagleCommand
  | SaveToReadwiseCommand
  | SaveToInstapaperCommand
  | SaveToOmnivoreCommand
  | SaveToObsidianCommand
  | SaveToOutlineCommand

export type EntryCommand = TipCommand | OpenInBrowserCommand

export type BasicCommand = EntryCommand | IntegrationCommand
