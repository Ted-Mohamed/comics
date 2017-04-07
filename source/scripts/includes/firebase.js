import Firebase from 'firebase/app'
import 'firebase/database'

export const app = Firebase.initializeApp({
    apiKey: FIREBASE_API_KEY,
    authDomain: AUTH_DOMAIN,
    databaseURL: FIREBASE_DATABASE_URL,
    projectId: FIREBASE_PROJECT_ID,
    storageBucket: FIREBASE_STORAGE_BUCKET,
    messagingSenderId: FIREBASE_MESSAGING_SENDER_ID
})

export const database = app.database()