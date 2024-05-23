import { User } from "@auth/core/types"

declare module "@auth/core/types" {
  interface User {
    handle?: string | null
  }
}
