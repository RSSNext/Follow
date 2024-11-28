// Entry commands

import type { FeedViewType } from "@follow/constants"

import type { Command } from "../types"
import type { COMMAND_ID } from "./id"

export type TipCommand = Command<{
  id: typeof COMMAND_ID.entry.tip
  fn: (data: { userId?: string; feedId?: string; entryId?: string }) => void
}>

export type StarCommand = Command<{
  id: typeof COMMAND_ID.entry.star
  fn: (data: { entryId: string; view?: FeedViewType }) => void
}>
export type UnStarCommand = Command<{
  id: typeof COMMAND_ID.entry.unstar
  fn: (data: { entryId: string }) => void
}>

export type DeleteCommand = Command<{
  id: typeof COMMAND_ID.entry.delete
  fn: (data: { entryId: string }) => void
}>

export type CopyLinkCommand = Command<{
  id: typeof COMMAND_ID.entry.copyLink
  fn: (data: { entryId: string }) => void
}>

export type CopyTitleCommand = Command<{
  id: typeof COMMAND_ID.entry.copyTitle
  fn: (data: { entryId: string }) => void
}>

export type OpenInBrowserCommand = Command<{
  id: typeof COMMAND_ID.entry.openInBrowser
  fn: (data: { entryId: string }) => void
}>

export type ViewSourceContentCommand = Command<{
  id: typeof COMMAND_ID.entry.viewSourceContent
  fn: (data: { entryId: string }) => void
}>
export type ViewEntryContentCommand = Command<{
  id: typeof COMMAND_ID.entry.viewEntryContent
  fn: () => void
}>

export type ShareCommand = Command<{
  id: typeof COMMAND_ID.entry.share
  fn: ({ entryId }) => void
}>

export type ReadCommand = Command<{
  id: typeof COMMAND_ID.entry.read
  fn: ({ entryId }) => void
}>

export type UnReadCommand = Command<{
  id: typeof COMMAND_ID.entry.unread
  fn: ({ entryId }) => void
}>

export type ToggleAISummaryCommand = Command<{
  id: typeof COMMAND_ID.entry.toggleAISummary
  fn: () => void
}>

export type ToggleAITranslationCommand = Command<{
  id: typeof COMMAND_ID.entry.toggleAITranslation
  fn: () => void
}>

export type EntryCommand =
  | TipCommand
  | StarCommand
  | UnStarCommand
  | DeleteCommand
  | CopyLinkCommand
  | CopyTitleCommand
  | OpenInBrowserCommand
  | ViewSourceContentCommand
  | ViewEntryContentCommand
  | ShareCommand
  | ReadCommand
  | UnReadCommand
  | ToggleAISummaryCommand
  | ToggleAITranslationCommand

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

export type BasicCommand = EntryCommand | IntegrationCommand
