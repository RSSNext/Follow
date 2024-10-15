import { getAnalytics } from "firebase/analytics"
import { initializeApp } from "firebase/app"

// See: https://firebase.google.com/docs/web/learn-more#config-object
// For Firebase JavaScript SDK v7.20.0 and later, `measurementId` is an optional field
const firebaseConfig = {
  apiKey: "AIzaSyDuM93019tp8VI7wsszJv8ChOs7b1EE5Hk",
  authDomain: "follow-428106.firebaseapp.com",
  projectId: "follow-428106",
  storageBucket: "follow-428106.appspot.com",
  messagingSenderId: "194977404578",
  appId: "1:194977404578:web:1920bb0c9ea5e2373669fb",
  measurementId: "G-SJE57D4F14",
}
// Initialize Firebase
const app = initializeApp(firebaseConfig)

// Initialize Analytics and get a reference to the service
export const analytics = getAnalytics(app)
