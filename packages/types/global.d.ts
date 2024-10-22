declare global {
  export type Nullable<T> = T | null | undefined
  type IsLiteralString<T> = T extends string ? (string extends T ? never : T) : never

  type OmitStringType<T> = T extends any[] ? OmitStringType<T[number]> : IsLiteralString<T>

  export const APP_NAME = "Follow"
}

export {}
