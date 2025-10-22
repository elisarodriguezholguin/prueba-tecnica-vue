import { initializeApp } from 'firebase/app'
import { getFirestore, collection } from 'firebase/firestore'
// ... other firebase imports

export const firebaseApp = initializeApp({
  // your application settings
  apiKey: "AIzaSyAVRmXmYfHneN9Ohgv8-0BZyBTsEH7WpAQ",
  authDomain: "entrenamiento-vue.firebaseapp.com",
  projectId: "entrenamiento-vue",
  storageBucket: "entrenamiento-vue.firebasestorage.app",
  messagingSenderId: "470941108335",
  appId: "1:470941108335:web:451670300d0d5c4685a59a"
})

// used for the firestore refs
export const db = getFirestore(firebaseApp)

// here we can export reusable database references
export const entrenamientosRef = collection(db, 'entrenamientos')