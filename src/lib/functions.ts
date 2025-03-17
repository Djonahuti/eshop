import { Client, Databases, Query } from 'appwrite';

const client = new Client()
    .setEndpoint(import.meta.env.VITE_APPWRITE_ENDPOINT) 
    .setProject(import.meta.env.VITE_APPWRITE_PROJECT_ID);

const database = new Databases(client);
const dbId = import.meta.env.VITE_APPWRITE_DATABASE_ID;

export const getProducts = async () => {
    try {
        const response = await database.listDocuments(dbId, 'products');
        return response.documents;
    } catch (error) {
        console.error("Error fetching products:", error);
        return [];
    }
};

export const getCategories = async () => {
    try {
        const response = await database.listDocuments(dbId, 'categories');
        return response.documents;
    } catch (error) {
        console.error("Error fetching categories:", error);
        return [];
    }
};

export const addToCart = async (userId: string, productId: string, quantity: number) => {
    try {
        const response = await database.createDocument(dbId, 'cart', 'unique()', {
            customer_id: userId,
            product_id: productId,
            qty: quantity,
        });
        return response;
    } catch (error) {
        console.error("Error adding to cart:", error);
    }
};

export const removeFromCart = async (cartItemId: string) => {
    try {
        await database.deleteDocument(dbId, 'cart', cartItemId);
    } catch (error) {
        console.error("Error removing from cart:", error);
    }
};

export const getWishlist = async (userId: string) => {
    try {
        const response = await database.listDocuments(dbId, 'wishlist', [
            Query.equal('customer_id', userId),
        ]);
        return response.documents;
    } catch (error) {
        console.error("Error fetching wishlist:", error);
        return [];
    }
};

export const checkout = async (userId: string, totalAmount: number) => {
    try {
        const response = await database.createDocument(dbId, 'payments', 'unique()', {
            customer_id: userId,
            amount: totalAmount,
            payment_mode: 'PayPal',
            payment_date: new Date().toISOString(),
        });
        return response;
    } catch (error) {
        console.error("Error processing payment:", error);
    }
};
