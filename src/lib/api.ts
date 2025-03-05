import { databases } from "./apprite";


const databaseId = import.meta.env.REACT_APP_APPWRITE_DATABASE_ID;

export const getProducts = async () => {
  return await databases.listDocuments(
    databaseId,
    import.meta.env.REACT_APP_COLLECTION_PRODUCTS
  );
};

export const getOrders = async () => {
  return await databases.listDocuments(
    databaseId,
    import.meta.env.REACT_APP_COLLECTION_ORDERS
  );
};
