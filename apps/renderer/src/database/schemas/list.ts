import type { ListModel } from "~/models"

export type DB_ListUnread = {
  id: string
}

export type DB_List = ListModel & { id: string }
