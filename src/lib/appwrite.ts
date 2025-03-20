// src/appwrite.ts
import { Client, Account, Databases, Storage, ID, Query } from 'appwrite';

const client = new Client();

const DB_ID = import.meta.env.VITE_APPWRITE_DATABASE_ID;
const ADMIN_COLLECTION_ID = import.meta.env.VITE_APPWRITE_ADMIN_COLLECTION_ID;
const CUSTOMERS_COLLECTION_ID = import.meta.env.VITE_APPWRITE_CUSTOMERS_COLLECTION_ID;
const ORDERS_COLLECTION_ID = import.meta.env.VITE_APPWRITE_ORDERS_COLLECTION_ID;

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

// Function to log out the user
export const logout = async () => {
  try {
    await account.deleteSession("current");
    window.location.href = "/login"; // Redirect after logout
  } catch (error) {
    console.error("Logout Error:", error);
  }
};



// Type Definitions
interface ProductData {
  name: string;
  price: number;
  pspPrice: number;
  description: string;
  features: string;
  keywords: string;
  label: string;
  status: string;
  productUrl: string;
  images: File[];
  video: File;
  categoryId: string;
  pCatId: string;
  manufacturerId: string;
}

// Fetch Categories
export const getCategories = async () => {
  try {
    const response = await databases.listDocuments(
      import.meta.env.VITE_APPWRITE_DATABASE_ID,
      import.meta.env.VITE_APPWRITE_CATEGORIES_COLLECTION_ID
    );
    return response.documents;
  } catch (error) {
    console.error("Error fetching categories:", error);
    return [];
  }
};

// Fetch Product Categories
export const getProductCategories = async () => {
  try {
    const response = await databases.listDocuments(
      import.meta.env.VITE_APPWRITE_DATABASE_ID,
      import.meta.env.VITE_APPWRITE_PRODUCT_CATEGORIES_COLLECTION_ID
    );
    return response.documents;
  } catch (error) {
    console.error("Error fetching product categories:", error);
    return [];
  }
};

// Fetch Manufacturers
export const getManufacturers = async () => {
  try {
    const response = await databases.listDocuments(
      import.meta.env.VITE_APPWRITE_DATABASE_ID,
      import.meta.env.VITE_APPWRITE_MANUFACTURERS_COLLECTION_ID
    );
    return response.documents;
  } catch (error) {
    console.error("Error fetching manufacturers:", error);
    return [];
  }
};

/* ==========================
   🚀 PRODUCTS FUNCTIONS
   ========================== */
// Add Product with Images & Video
export const addProduct = async ({
  name,
  price,
  pspPrice,
  description,
  features,
  keywords,
  label,
  status,
  productUrl,
  images,
  video,
  categoryId,
  pCatId,
  manufacturerId,
}: ProductData) => {
  try {
    // Ensure `features` is stored as an array
    const featuresArray = Array.isArray(features) ? features : features.split(",").map((f) => f.trim());

    // Ensure relationships are stored as arrays
    const categoryArray = Array.isArray(categoryId) ? categoryId : [categoryId];
    const pCatArray = Array.isArray(pCatId) ? pCatId : [pCatId];
    const manufacturerArray = Array.isArray(manufacturerId) ? manufacturerId : [manufacturerId];

    // Upload images to Appwrite Storage
    const uploadedImages = await Promise.all(
      images.map(async (image: File) => {
        const uploaded = await storage.createFile(
          import.meta.env.VITE_APPWRITE_BUCKET_ID,
          ID.unique(),
          image
        );
        return storage.getFileView(import.meta.env.VITE_APPWRITE_BUCKET_ID, uploaded.$id);
      })
    );

    // Upload video to Appwrite Storage (if provided)
    let videoUrl = null;
    if (video instanceof File) {
      const uploadedVideo = await storage.createFile(
        import.meta.env.VITE_APPWRITE_BUCKET_ID,
        ID.unique(),
        video
      );
      videoUrl = storage.getFileView(import.meta.env.VITE_APPWRITE_BUCKET_ID, uploadedVideo.$id);
    }

    // Create product in Appwrite database
    await databases.createDocument(
      import.meta.env.VITE_APPWRITE_DATABASE_ID,
      import.meta.env.VITE_APPWRITE_PRODUCTS_COLLECTION_ID,
      ID.unique(),
      {
        product_title: name,
        product_price: price,
        product_psp_price: pspPrice,
        product_desc: description,
        product_features: featuresArray, // ✅ Now correctly formatted as an array
        product_keywords: keywords,
        product_label: label,
        status,
        product_img1: uploadedImages[0] || null,
        product_img2: uploadedImages[1] || null,
        product_img3: uploadedImages[2] || null,
        product_video: videoUrl, // ✅ Save video URL
        product_url: productUrl,
        cat_id: categoryArray, // ✅ Now correctly formatted as an array
        p_cat_id: pCatArray, // ✅ Now correctly formatted as an array
        manufacturer_id: manufacturerArray, // ✅ Now correctly formatted as an array
        created_at: new Date().toISOString(),
      }
    );
  } catch (error) {
    console.error("Error adding product:", error);
  }
};

/* ==========================
   🚀 GET PRODUCTS FUNCTIONS
   ========================== */
// Get Product with Images & Video
export async function getProducts() {
  try {
    const products = await databases.listDocuments(
      import.meta.env.VITE_APPWRITE_DATABASE_ID!,
      import.meta.env.VITE_APPWRITE_PRODUCTS_COLLECTION_ID!
    );

    const categories = await databases.listDocuments(
      import.meta.env.VITE_APPWRITE_DATABASE_ID!,
      import.meta.env.VITE_APPWRITE_CATEGORIES_COLLECTION_ID!
    );
    
    const productCategories = await databases.listDocuments(
      import.meta.env.VITE_APPWRITE_DATABASE_ID!,
      import.meta.env.VITE_APPWRITE_PRODUCT_CATEGORIES_COLLECTION_ID!
    );
    
    const manufacturers = await databases.listDocuments(
      import.meta.env.VITE_APPWRITE_DATABASE_ID!,
      import.meta.env.VITE_APPWRITE_MANUFACTURERS_COLLECTION_ID!
    );

    console.log('Fetched Categories:', categories.documents);
    console.log('Fetched Product Categories:', productCategories.documents);
    console.log('Fetched Manufacturers:', manufacturers.documents);

    const categoryMap = Object.fromEntries(categories.documents.map(cat => [cat.$id, cat.cat_title || cat.name]));
    const productCategoryMap = Object.fromEntries(productCategories.documents.map(pCat => [pCat.$id, pCat.p_cat_title || pCat.name]));
    const manufacturerMap = Object.fromEntries(manufacturers.documents.map(man => [man.$id, man.manufacturer_title || man.name]));
    console.log("Fetched Products:", products.documents);

    return products.documents.map(product => ({
      ...product,
      categoryName: categoryMap[product.cat_id[0]] || 'Unknown',
      productCategoryName: productCategoryMap[product.p_cat_id[0]] || 'Unknown',
      manufacturerName: manufacturerMap[product.manufacturer_id[0]] || 'Unknown',
      price: product.price || 'N/A',
      product_psp_price: product.product_psp_price || 0,
      product_features: product.product_features || [],
      product_desc: product.product_desc || '',
      product_video: product.product_video || '',
      product_label: product.product_label || '',
    }));
  } catch (error) {
    console.error('Error fetching products:', error);
    return [];
  }
};

// Delete Product
export const deleteProduct = async (productId: string) => {
  try {
    return await databases.deleteDocument(DB_ID, "products", productId);
  } catch (error) {
    console.error("Error deleting product:", error);
  }
};

/* ==========================
   🛒 CART FUNCTIONS
   ========================== */
export const addToCart = async (cartItem: { ip_add: string; p_id: string; qty: number; size: string; price: number }) => {
  try {
    return await databases.createDocument(DB_ID, "cart", ID.unique(), cartItem);
  } catch (error) {
    console.error("Error adding to cart:", error);
  }
};

/* ==========================
   ❤️ WISHLIST FUNCTIONS
   ========================== */
export const addToWishlist = async (wishlistItem: { customer_id: string; product_id: string }) => {
  try {
    return await databases.createDocument(DB_ID, "wishlist", ID.unique(), wishlistItem);
  } catch (error) {
    console.error("Error adding to wishlist:", error);
  }
};

/* ==========================
   🎟️ COUPON FUNCTIONS
   ========================== */
export const applyCoupon = async (couponCode: string) => {
  try {
    const coupons = await databases.listDocuments(DB_ID, "coupons");
    return coupons.documents.find((c) => c.coupon_code === couponCode) || null;
  } catch (error) {
    console.error("Error applying coupon:", error);
  }
};

/* ==========================
   💳 PAYMENT FUNCTIONS
   ========================== */
export const processPayment = async (paymentData: {
  amount: number;
  invoice_no: string;
  ref_no: string;
  code: string;
  payment_mode: string;
}) => {
  try {
    return await databases.createDocument(DB_ID, "payments", ID.unique(), paymentData);
  } catch (error) {
    console.error("Error processing payment:", error);
  }
};

/* ==========================
   📦 ORDERS FUNCTIONS
   ========================== */
// Fetch Orders
export const getOrders = async () => {
  try {
    const response = await databases.listDocuments(DB_ID, ORDERS_COLLECTION_ID);
    return response.documents || []; // Ensure it returns only the documents array
  } catch (error) {
    console.error("Error fetching orders:", error);
    return []; // Prevent crash if request fails
  }
};

// Update Order Status
export const updateOrderStatus = async (orderId: string, status: string) => {
  try {
    return await databases.updateDocument(DB_ID, "orders", orderId, { status });
  } catch (error) {
    console.error("Error updating order status:", error);
  }
};

/* ==========================
   👥 USERS FUNCTIONS
   ========================== */
// Fetch Users
export const getUsers = async () => {
  try {
    // Fetch customers
    const customers = await databases.listDocuments(DB_ID, CUSTOMERS_COLLECTION_ID);

    // Fetch admins
    const admins = await databases.listDocuments(DB_ID, ADMIN_COLLECTION_ID);

    // Format users data
    return [
      ...customers.documents.map((customer) => ({
        id: customer.$id,
        name: customer.customer_name,
        email: customer.customer_email,
        role: "customer",
        profileImage: customer.customer_image,
      })),
      ...admins.documents.map((admin) => ({
        id: admin.$id,
        name: admin.admin_name,
        email: admin.admin_email,
        role: "admin",
        profileImage: admin.admin_image,
      })),
    ]; // Ensure it returns only the documents array
  } catch (error) {
    console.error("Error fetching users:", error);
    return []; // Prevent crash if request fails
  }
};

// Function to get the logged-in user's profile picture
export const getProfileImage = async () => {
  try {
    const user = await account.get();
    const email = user.email;

    // Check if user is a customer
    const customerQuery = await databases.listDocuments(
      import.meta.env.VITE_APPWRITE_DATABASE_ID,
      import.meta.env.VITE_APPWRITE_CUSTOMERS_COLLECTION_ID,
      [Query.equal("customer_email", email)]
    );

    if (customerQuery.documents.length > 0) {
      return customerQuery.documents[0].customer_image;
    }

    // Check if user is an admin
    const adminQuery = await databases.listDocuments(
      import.meta.env.VITE_APPWRITE_DATABASE_ID,
      import.meta.env.VITE_APPWRITE_ADMIN_COLLECTION_ID,
      [Query.equal("admin_email", email)]
    );

    if (adminQuery.documents.length > 0) {
      return adminQuery.documents[0].admin_image;
    }

    return null;
  } catch (error) {
    console.error("Error fetching profile image:", error);
    return null;
  }
};

// Delete User
export const deleteUser = async (userId: string) => {
  try {
    return await databases.deleteDocument(DB_ID, "customers", userId);
  } catch (error) {
    console.error("Error deleting user:", error);
  }
};

// Function to get the logged-in user's profile picture
export const getUserDetails = async () => {
  try {
    const user = await account.get();
    const email = user.email;

    // Check if user is a customer
    const customerQuery = await databases.listDocuments(
      import.meta.env.VITE_APPWRITE_DATABASE_ID,
      import.meta.env.VITE_APPWRITE_CUSTOMERS_COLLECTION_ID,
      [Query.equal("customer_email", email)]
    );

    if (customerQuery.documents.length > 0) {
      return customerQuery.documents.map(customer => ({
        ...customer,
        customer_name: customer.customer_name,
        customer_email: customer.customer_email,
        customer_contact: customer.customer_contact,
      }));
    }

    // Check if user is an admin
    const adminQuery = await databases.listDocuments(
      import.meta.env.VITE_APPWRITE_DATABASE_ID,
      import.meta.env.VITE_APPWRITE_ADMIN_COLLECTION_ID,
      [Query.equal("admin_email", email)]
    );

    if (adminQuery.documents.length > 0) {
      return adminQuery.documents.map(admin => ({
        ...admin,
        admin_name: admin.admin_name,
        admin_email: admin.admin_email,
        admin_contact: admin.admin_contact,
        admin_job: admin.admin_job,
        admin_about: admin.admin_about,
      }));
    }

    return null;
  } catch (error) {
    console.error("Error fetching Details:", error);
    return null;
  }
};

export default {
  addProduct,
  getProducts,
  getCategories,
  getProductCategories,
  getUserDetails,
  getManufacturers,
  client
};