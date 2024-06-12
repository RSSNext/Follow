declare module "@auth/core/types" {
  interface User {
    handle?: string | null

    id: string
    name: string
    image: string
  }

  interface Session {
    user: User
  }
}
