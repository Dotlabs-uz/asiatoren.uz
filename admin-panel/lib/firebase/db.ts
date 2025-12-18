import {
  collection,
  doc,
  getDocs,
  getDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  QuerySnapshot,
  DocumentSnapshot,
  DocumentData,
  WithFieldValue,
  UpdateData,
} from "firebase/firestore"
import { db } from "./config"

/**
 * Get all items from a collection
 */
export const getItems = async (
  collectionName: string
): Promise<DocumentData[]> => {
  try {
    const querySnapshot: QuerySnapshot<DocumentData> = await getDocs(
      collection(db, collectionName)
    )
    return querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }))
  } catch (error) {
    throw error
  }
}

/**
 * Get a single item by ID from a collection
 */
export const getItem = async (
  collectionName: string,
  id: string
): Promise<DocumentData | null> => {
  try {
    const docRef = doc(db, collectionName, id)
    const docSnap: DocumentSnapshot<DocumentData> = await getDoc(docRef)

    if (docSnap.exists()) {
      return {
        id: docSnap.id,
        ...docSnap.data(),
      }
    } else {
      return null
    }
  } catch (error) {
    throw error
  }
}

/**
 * Add a new item to a collection
 */
export const addItem = async (
  collectionName: string,
  data: WithFieldValue<DocumentData>
): Promise<string> => {
  try {
    const docRef = await addDoc(collection(db, collectionName), data)
    return docRef.id
  } catch (error) {
    throw error
  }
}

/**
 * Update an existing item in a collection
 */
export const updateItem = async (
  collectionName: string,
  id: string,
  data: UpdateData<DocumentData>
): Promise<void> => {
  try {
    const docRef = doc(db, collectionName, id)
    await updateDoc(docRef, data)
  } catch (error) {
    throw error
  }
}

/**
 * Delete an item from a collection
 */
export const deleteItem = async (
  collectionName: string,
  id: string
): Promise<void> => {
  try {
    const docRef = doc(db, collectionName, id)
    await deleteDoc(docRef)
  } catch (error) {
    throw error
  }
}

