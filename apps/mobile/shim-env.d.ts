declare namespace NodeJS {
  export interface ProcessEnv {
    EXPO_PUBLIC_FOLLOW_LOGIN_URL: string
    [key: string]: string | undefined
  }
}
