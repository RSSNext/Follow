import path from "node:path"

import { app } from "electron"

export const UNREAD_BACKGROUND_POLLING_INTERVAL = 1000 * 60 * 5

export const HOTUPDATE_RENDER_ENTRY_DIR = path.resolve(app.getPath("userData"), "render")

export const GITHUB_OWNER = process.env.GITHUB_OWNER || "RSSNext"
export const GITHUB_REPO = process.env.GITHUB_REPO || "follow"

// https://github.com/electron/electron/issues/25081
export const START_IN_TRAY_ARGS = "--start-in-tray"
