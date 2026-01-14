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
import { Dealer, DealerFormData } from "@/types";

const COLLECTION_NAME = "our-dealers";

export const getAllDealers = async (): Promise<Dealer[]> => {
    const q = query(
        collection(db, COLLECTION_NAME),
        orderBy("createdAt", "asc")
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate(),
        updatedAt: doc.data().updatedAt?.toDate(),
    })) as Dealer[];
};

export const addDealer = async (data: DealerFormData) => {
    return await addDoc(collection(db, COLLECTION_NAME), {
        ...data,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
    });
};

export const updateDealer = async (
    id: string,
    data: Partial<DealerFormData>
) => {
    const docRef = doc(db, COLLECTION_NAME, id);
    await updateDoc(docRef, { ...data, updatedAt: serverTimestamp() });
};

export const deleteDealer = async (id: string) => {
    await deleteDoc(doc(db, COLLECTION_NAME, id));
};
