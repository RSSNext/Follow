import { action } from "./actions"
import { ai } from "./ai"
import { auth } from "./auth"
import { discover } from "./discover"
import { entries } from "./entries"
import { feed } from "./feed"
import { subscription } from "./subscriptions"
import { wallet } from "./wallet"

export const Queries = {
  subscription,
  entries,
  feed,
  action,
  auth,
  ai,
  discover,
  wallet,
}
