import { action } from "./actions"
import { ai } from "./ai"
import { auth } from "./auth"
import { discover } from "./discover"
import { entries } from "./entries"
import { feed } from "./feed"
import { invitations } from "./invitations"
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
  invitations,
}
