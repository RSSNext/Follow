import { env } from "@follow/shared/env"
import {
  getAnalytics,
  logEvent as firebaseLogEvent,
  setUserId as firebaseSetUserId,
  setUserProperties as firebaseSetUserProperties,
} from "firebase/analytics"
import { initializeApp } from "firebase/app"

// See: https://firebase.google.com/docs/web/learn-more#config-object
// For Firebase JavaScript SDK v7.20.0 and later, `measurementId` is an optional field
const firebaseConfig = env.VITE_FIREBASE_CONFIG ? JSON.parse(env.VITE_FIREBASE_CONFIG) : undefined
// Initialize Firebase
const app = initializeApp(firebaseConfig)

// Initialize Analytics and get a reference to the service
const analytics = getAnalytics(app)

export const logEvent = (event: string, eventParams?: Record<string, unknown>) => {
  firebaseLogEvent(analytics, event, eventParams)
}

export const setUserId = (userId: string) => {
  firebaseSetUserId(analytics, userId)
}

export const setUserProperties = (properties: Record<string, unknown>) => {
  firebaseSetUserProperties(analytics, properties)
}
