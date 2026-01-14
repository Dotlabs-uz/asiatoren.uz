import {
    collection,
    doc,
    getDocs,
    addDoc,
    updateDoc,
    deleteDoc,
    query,
    orderBy,
    serverTimestamp,
} from "firebase/firestore";
import { db } from "./config";
import { Video, VideoFormData } from "@/types";

const COLLECTION_NAME = "videos";

export const getAllVideos = async (): Promise<Video[]> => {
    const q = query(
        collection(db, COLLECTION_NAME),
        orderBy("createdAt", "desc")
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate(),
        updatedAt: doc.data().updatedAt?.toDate(),
    })) as Video[];
};

export const addVideo = async (data: VideoFormData) => {
    return await addDoc(collection(db, COLLECTION_NAME), {
        ...data,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
    });
};

export const updateVideo = async (id: string, data: Partial<VideoFormData>) => {
    const docRef = doc(db, COLLECTION_NAME, id);
    await updateDoc(docRef, { ...data, updatedAt: serverTimestamp() });
};

export const deleteVideo = async (id: string) => {
    await deleteDoc(doc(db, COLLECTION_NAME, id));
};
