"use client";

import {
    signInWithEmailAndPassword,
    signOut as firebaseSignOut,
    onAuthStateChanged,
    User,
    UserCredential,
} from "firebase/auth";
import { auth } from "./config";
import { useEffect, useState } from "react";

/**
 * Sign in with email and password
 */
export const signIn = async (
    email: string,
    password: string
): Promise<UserCredential> => {
    try {
        const userCredential = await signInWithEmailAndPassword(
            auth,
            email,
            password
        );

        // Получаем ID токен
        const idToken = await userCredential.user.getIdToken();

        // Сохраняем токен в cookie через API route
        await fetch("/api/auth/session", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ idToken }),
        });

        // Небольшая задержка чтобы cookie точно установился
        await new Promise((resolve) => setTimeout(resolve, 100));

        return userCredential;
    } catch (error) {
        throw error;
    }
};
/**
 * Sign out current user
 */
export const signOut = async (): Promise<void> => {
    try {
        await firebaseSignOut(auth);

        // Удаляем cookie через API route
        await fetch("/api/auth/session", {
            method: "DELETE",
        });
    } catch (error) {
        throw error;
    }
};

/**
 * Get current authenticated user
 */
export const getCurrentUser = (): User | null => {
    return auth.currentUser;
};

/**
 * React hook to check authentication state
 */
export const useAuth = () => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser);
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    return { user, loading };
};
