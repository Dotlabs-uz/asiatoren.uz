import {
  collection,
  getDocs,
  getDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  serverTimestamp,
  query,
  orderBy,
} from 'firebase/firestore'
import { db } from './config'
import { Product, ProductFormData } from '@/types'

const COLLECTION_NAME = 'products'

/**
 * Получить все товары
 */
export const getProducts = async (): Promise<Product[]> => {
  try {
    const productsRef = collection(db, COLLECTION_NAME)
    const q = query(productsRef, orderBy('createdAt', 'desc'))
    const snapshot = await getDocs(q)

    return snapshot.docs.map((doc) => {
      const data = doc.data()
      return {
        id: doc.id,
        title: data.title || '',
        description: data.description || '',
        price: data.price || 0,
        features: data.features || [],
        categoryId: data.categoryId || '',
        images: data.images || [],
        createdAt: data.createdAt?.toDate() || new Date(),
        updatedAt: data.updatedAt?.toDate() || new Date(),
      } as Product
    })
  } catch (error) {
    console.error('Error getting products:', error)
    throw error
  }
}

/**
 * Получить один товар по ID
 */
export const getProduct = async (id: string): Promise<Product | null> => {
  try {
    const productRef = doc(db, COLLECTION_NAME, id)
    const snapshot = await getDoc(productRef)

    if (!snapshot.exists()) {
      return null
    }

    const data = snapshot.data()
    return {
      id: snapshot.id,
      title: data.title || '',
      description: data.description || '',
      price: data.price || 0,
      features: data.features || [],
      categoryId: data.categoryId || '',
      images: data.images || [],
      createdAt: data.createdAt?.toDate() || new Date(),
      updatedAt: data.updatedAt?.toDate() || new Date(),
    } as Product
  } catch (error) {
    console.error('Error getting product:', error)
    throw error
  }
}

/**
 * Создать новый товар
 */
export const addProduct = async (data: ProductFormData): Promise<string> => {
  try {
    const productsRef = collection(db, COLLECTION_NAME)

    const productData = {
      title: data.title,
      description: data.description,
      price: data.price,
      features: data.features || [],
      categoryId: data.categoryId,
      images: data.images || [],
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    }

    const docRef = await addDoc(productsRef, productData)
    return docRef.id
  } catch (error) {
    console.error('Error adding product:', error)
    throw error
  }
}

/**
 * Обновить товар
 */
export const updateProduct = async (
  id: string,
  data: Partial<ProductFormData>
): Promise<void> => {
  try {
    const productRef = doc(db, COLLECTION_NAME, id)

    const updateData: any = {
      updatedAt: serverTimestamp(),
    }

    // Добавляем только те поля, которые переданы
    if (data.title !== undefined) updateData.title = data.title
    if (data.description !== undefined) updateData.description = data.description
    if (data.price !== undefined) updateData.price = data.price
    if (data.features !== undefined) updateData.features = data.features
    if (data.categoryId !== undefined) updateData.categoryId = data.categoryId
    if (data.images !== undefined) updateData.images = data.images

    await updateDoc(productRef, updateData)
  } catch (error) {
    console.error('Error updating product:', error)
    throw error
  }
}

/**
 * Удалить товар
 */
export const deleteProduct = async (id: string): Promise<void> => {
  try {
    const productRef = doc(db, COLLECTION_NAME, id)
    await deleteDoc(productRef)
  } catch (error) {
    console.error('Error deleting product:', error)
    throw error
  }
}

/**
 * Получить товары по категории
 */
export const getProductsByCategory = async (
  categoryId: string
): Promise<Product[]> => {
  try {
    const productsRef = collection(db, COLLECTION_NAME)
    const q = query(
      productsRef,
      orderBy('createdAt', 'desc')
    )
    const snapshot = await getDocs(q)

    // Фильтруем на клиенте (можно оптимизировать через where если нужно)
    const products = snapshot.docs
      .map((doc) => {
        const data = doc.data()
        return {
          id: doc.id,
          title: data.title || '',
          description: data.description || '',
          price: data.price || 0,
          features: data.features || [],
          categoryId: data.categoryId || '',
          images: data.images || [],
          createdAt: data.createdAt?.toDate() || new Date(),
          updatedAt: data.updatedAt?.toDate() || new Date(),
        } as Product
      })
      .filter((product) => product.categoryId === categoryId)

    return products
  } catch (error) {
    console.error('Error getting products by category:', error)
    throw error
  }
}