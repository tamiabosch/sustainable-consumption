// Get the imports
import { CollectionReference, collection, DocumentData } from 'firebase/firestore'
import { db as firestore } from './firebaseConfig'
// Import all your model types
import { User } from './../models/User'

// This is just a helper to add the type to the db responses
const createCollection = <T = DocumentData>(collectionName: string) => {
  return collection(firestore, collectionName) as CollectionReference<T>
}

// export all your collections
export const usersCol = createCollection<User>('users')