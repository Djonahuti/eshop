// src/appwrite.ts
import { Client, Account, Databases, Storage, ID } from 'appwrite';

const client = new Client();

client
  .setEndpoint(import.meta.env.VITE_APPWRITE_ENDPOINT) // API endpoint
  .setProject(import.meta.env.VITE_APPWRITE_PROJECT_ID); // Project ID

export const account = new Account(client);
export const databases = new Databases(client);
export const storage = new Storage(client);

export const authService = {
  async signup(email: string, password: string, name: string) {
    return await account.create('unique()', email, password, name);
  },
  
  async login(email: string, password: string) {
    return await account.createEmailPasswordSession(email, password);
  },
  
  async logout() {
    return await account.deleteSession('current');
  },
  
  async getUser() {
    return await account.get();
  }
};

export default client;

export const useAppwrite = () => {
  // Fetch Categories
  const getCategories = async () => {
    const response = await databases.listDocuments(
      import.meta.env.VITE_APPWRITE_DATABASE_ID,
      import.meta.env.VITE_APPWRITE_CATEGORIES_COLLECTION_ID
    );
    return response.documents;
  };

  // Fetch Subcategories
  const getSubCategories = async () => {
    const response = await databases.listDocuments(
      import.meta.env.VITE_APPWRITE_DATABASE_ID,
      import.meta.env.VITE_APPWRITE_SUBCATEGORIES_COLLECTION_ID
    );
    return response.documents;
  };

  // Add Product with Images
  const addProduct = async ({ name, price, images, categoryId, subCategoryId }: { name: string; price: string; images: File; categoryId: string; subCategoryId: string; }) => {
    try {
      // Upload four images to Appwrite storage
          const uploadedImages = await Promise.all(
            images.map(async (image) => {
              const uploaded = await storage.createFile(
                import.meta.env.VITE_APPWRITE_BUCKET_ID,
                ID.unique(),
                image
              );
              return storage.getFileView(import.meta.env.VITE_APPWRITE_BUCKET_ID, uploaded.$id);
            })
          );
          
                await databases.createDocument(
                  import.meta.env.VITE_APPWRITE_DATABASE_ID,
                  import.meta.env.VITE_APPWRITE_PRODUCTS_COLLECTION_ID,
                  ID.unique(),
                  {
                    name,
                    price: parseFloat(price),
                    category_id: categoryId,
                    sub_category_id: subCategoryId,
                    image1: uploadedImages[0] || null,
                    image2: uploadedImages[1] || null,
                    image3: uploadedImages[2] || null,
                    image4: uploadedImages[3] || null,
                    created_at: new Date().toISOString(),
                  }
                );
              } catch (error) {
                console.error("Error adding product:", error);
              }
            };

            return { addProduct, getCategories, getSubCategories };
          };
