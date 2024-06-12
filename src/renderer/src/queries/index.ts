import { action } from "./actions"
import { auth } from "./auth"
import { entries } from "./entries"
import { feed } from "./feed"
import { subscription } from "./subscriptions"

export const Queries = {
  subscription,
  entries,
  feed,
  action,
  auth,
}
