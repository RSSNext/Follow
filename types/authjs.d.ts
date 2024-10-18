declare module "@auth/core/types" {
  interface User {
    handle?: string | null

    id: string
    name: string
    email: string
    emailVerified: null
    image: string
    handle: null
    createdAt: string
  }

  interface Session {
    user: User
    role: "user" | "trial"
  }
}
