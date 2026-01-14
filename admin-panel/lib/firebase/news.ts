import {
    collection,
    doc,
    getDocs,
    getDoc,
    addDoc,
    updateDoc,
    deleteDoc,
    query,
    orderBy,
    serverTimestamp,
} from "firebase/firestore";
import { db } from "./config";
import { News, NewsFormData } from "@/types";

const COLLECTION_NAME = "news";

const mapDocToNews = (doc: any): News => {
    const data = doc.data();
    return {
        id: doc.id,
        title: data.title,
        previewImageUrl: data.previewImageUrl || "",
        content: data.content,
        images: data.images || [],
        createdAt: data.createdAt?.toDate() || new Date(),
        updatedAt: data.updatedAt?.toDate() || new Date(),
    };
};

export const getAllNews = async (): Promise<News[]> => {
    const q = query(
        collection(db, COLLECTION_NAME),
        orderBy("createdAt", "desc")
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map(mapDocToNews);
};

export const addNews = async (data: NewsFormData): Promise<string> => {
    const docRef = await addDoc(collection(db, COLLECTION_NAME), {
        ...data,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
    });
    return docRef.id;
};

export const updateNews = async (
    id: string,
    data: Partial<NewsFormData>
): Promise<void> => {
    const docRef = doc(db, COLLECTION_NAME, id);
    await updateDoc(docRef, { ...data, updatedAt: serverTimestamp() });
};

export const deleteNews = async (id: string): Promise<void> => {
    await deleteDoc(doc(db, COLLECTION_NAME, id));
};
