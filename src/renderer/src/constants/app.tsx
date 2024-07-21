import * as semver from "semver"

import { getStorageNS } from "../lib/ns"

/// Feed
export const FEED_COLLECTION_LIST = "collections"
/// Local storage keys
export const QUERY_PERSIST_KEY = getStorageNS("REACT_QUERY_OFFLINE_CACHE")

/// Route Keys
export const ROUTE_FEED_PENDING = "all"
export const ROUTE_ENTRY_PENDING = "pending"
export const ROUTE_FEED_IN_FOLDER = "folder-"

export const channel = import.meta.env.DEV ?
  "development" :
    (semver.prerelease(APP_VERSION)?.[0] as string) || "stable"
