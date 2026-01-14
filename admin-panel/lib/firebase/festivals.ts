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
import { Festival, FestivalFormData } from "@/types";

const COLLECTION_NAME = "festivals";

const mapDocToFestival = (doc: any): Festival => {
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

export const getAllFestivals = async (): Promise<Festival[]> => {
    const q = query(
        collection(db, COLLECTION_NAME),
        orderBy("createdAt", "desc")
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map(mapDocToFestival);
};

export const addFestival = async (data: FestivalFormData): Promise<string> => {
    const docRef = await addDoc(collection(db, COLLECTION_NAME), {
        ...data,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
    });
    return docRef.id;
};

export const updateFestival = async (
    id: string,
    data: Partial<FestivalFormData>
): Promise<void> => {
    const docRef = doc(db, COLLECTION_NAME, id);
    await updateDoc(docRef, { ...data, updatedAt: serverTimestamp() });
};

export const deleteFestival = async (id: string): Promise<void> => {
    await deleteDoc(doc(db, COLLECTION_NAME, id));
};
