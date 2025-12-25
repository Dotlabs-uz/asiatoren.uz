/**
 * Product/Item interface for catalog
 */
export interface Product {
    id: string;
    title: string;
    description: string;
    price: number;
    images: string[];
    categoryId: string;
    createdAt: Date;
    updatedAt: Date;
    features?: string[];
}

/**
 * Product data for forms (without id and timestamps)
 */
export interface ProductFormData {
    title: string;
    description: string;
    price: number;
    images: string[];
    categoryId: string;
    stock?: number;
    isActive?: boolean;
    tags?: string[];
    features?: string[];
}

/**
 * Login form data
 */
export interface LoginFormData {
    email: string;
    password: string;
}

/**
 * Category interface
 */
export interface Category {
    id: string;
    title: string;
    createdAt: Date;
    updatedAt: Date;
}

/**
 * Categories enum
 */
export enum ProductCategory {
    ELECTRONICS = "electronics",
    CLOTHING = "clothing",
    FOOD = "food",
    BOOKS = "books",
    SPORTS = "sports",
    HOME = "home",
    BEAUTY = "beauty",
    TOYS = "toys",
    OTHER = "other",
}

export interface Application {
    id: string;
    name: string;
    surname: string;
    phoneNumber: string;
    email: string;
    text?: string;
    createdAt: Date;
    status: "new" | "processing" | "completed";
}

export interface ApplicationFormData {
    name: string;
    surname: string;
    phoneNumber: string;
    email: string;
    text?: string;
}

export interface Media {
    id: string;
    title: string;
    imageUrl: string;
    type: 'certificate' | 'partner';
    createdAt: Date;
    updatedAt: Date;
}

/**
 * Firebase Firestore document snapshot type
 */
export interface FirebaseDocument {
    id: string;
    [key: string]: unknown;
}

/**
 * Firebase Firestore query response type
 */
export interface FirebaseQueryResponse<T = FirebaseDocument> {
    data: T[];
    error: Error | null;
}

/**
 * Firebase Firestore document response type
 */
export interface FirebaseDocumentResponse<T = FirebaseDocument> {
    data: T | null;
    error: Error | null;
}

/**
 * Firebase Storage upload response
 */
export interface FirebaseStorageUploadResponse {
    url: string;
    path: string;
    error: Error | null;
}

/**
 * Firebase Auth response types
 */
export interface FirebaseAuthResponse {
    user: {
        uid: string;
        email: string | null;
        displayName: string | null;
    } | null;
    error: Error | null;
}

/**
 * Generic API response wrapper
 */
export interface ApiResponse<T = unknown> {
    success: boolean;
    data?: T;
    error?: string;
    message?: string;
}

/**
 * Pagination metadata
 */
export interface PaginationMeta {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
}

/**
 * Paginated API response
 */
export interface PaginatedResponse<T = unknown> extends ApiResponse<T[]> {
    meta: PaginationMeta;
}
