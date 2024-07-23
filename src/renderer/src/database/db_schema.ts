export const dbSchemaV1 = {
  entries: "&id",
  feeds: "&id",
  subscriptions: "&id",
  entryRelated: "&id",
  feedEntries: "&feedId",
  feedUnreads: "&id",
}

export const dbSchemaV2 = {
  ...dbSchemaV1,
  subscriptions: "&id, userId, feedId",
}

export const dbSchemaV3 = {
  ...dbSchemaV1,
  subscriptions: "&id, userId, &feedId",
}
