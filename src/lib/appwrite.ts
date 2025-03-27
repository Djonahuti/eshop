// src/appwrite.ts
import { Client, Account, Databases, Storage, ID, Query } from 'appwrite';

const client = new Client();

const DB_ID = import.meta.env.VITE_APPWRITE_DATABASE_ID;
const ADMIN_COLLECTION_ID = import.meta.env.VITE_APPWRITE_ADMIN_COLLECTION_ID;
const CUSTOMERS_COLLECTION_ID = import.meta.env.VITE_APPWRITE_CUSTOMERS_COLLECTION_ID;
const ORDERS_COLLECTION_ID = import.meta.env.VITE_APPWRITE_ORDERS_COLLECTION_ID;
const MF_ID = import.meta.env.VITE_APPWRITE_MANUFACTURERS_COLLECTION_ID;
const PD_ID = import.meta.env.VITE_APPWRITE_PRODUCTS_COLLECTION_ID;

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



// Category Type Definitions
interface CategoryData {
  name: string;
  top: boolean;
  image: File;
};


// Product Category Type Definitions
interface ProductCategoryData {
  name: string;
  top: boolean;
  image: File;
};


// Manufacturer Type Definitions
interface ManufacturerData {
  name: string;
  top: boolean;
  image: File;
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

/* ==========================
   🚀 CATEGORIES FUNCTIONS
   ========================== */
// Add Category with Image
export const addCategory = async ({
  name,
  top,
  image,
}: CategoryData) => {
  try {

    // Upload image to Appwrite Storage (if provided)
    let imageUrl = null;
    if (image instanceof File) {
      const uploadedImage = await storage.createFile(
        import.meta.env.VITE_APPWRITE_BUCKET_ID,
        ID.unique(),
        image
      );
      imageUrl = storage.getFileView(import.meta.env.VITE_APPWRITE_BUCKET_ID, uploadedImage.$id);
    }

    // Create Category in Appwrite database
    await databases.createDocument(
      import.meta.env.VITE_APPWRITE_DATABASE_ID,
      import.meta.env.VITE_APPWRITE_CATEGORIES_COLLECTION_ID,
      ID.unique(),
      {
        cat_title: name,
        cat_top: top,
        cat_image: imageUrl, // ✅ Save video URL
      }
    );
  } catch (error) {
    console.error("Error adding category:", error);
  }
};

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

/* ==========================
   🚀 PRODUCT CATEGORIES FUNCTIONS
   ========================== */
// Add Product Category with Image
export const addProductCategory = async ({
  name,
  top,
  image,
}: ProductCategoryData) => {
  try {

    // Upload image to Appwrite Storage (if provided)
    let imageUrl = null;
    if (image instanceof File) {
      const uploadedImage = await storage.createFile(
        import.meta.env.VITE_APPWRITE_BUCKET_ID,
        ID.unique(),
        image
      );
      imageUrl = storage.getFileView(import.meta.env.VITE_APPWRITE_BUCKET_ID, uploadedImage.$id);
    }

    // Create Product Category in Appwrite database
    await databases.createDocument(
      import.meta.env.VITE_APPWRITE_DATABASE_ID,
      import.meta.env.VITE_APPWRITE_PRODUCT_CATEGORIES_COLLECTION_ID,
      ID.unique(),
      {
        p_cat_title: name,
        p_cat_top: top,
        p_cat_image: imageUrl, // ✅ Save video URL
      }
    );
  } catch (error) {
    console.error("Error adding product category:", error);
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

/* ==========================
   🚀 MANUFACTURER FUNCTIONS
   ========================== */
// Add Product Category with Image
export const addManufacturer = async ({
  name,
  top,
  image,
}: ManufacturerData) => {
  try {

    // Upload image to Appwrite Storage (if provided)
    let imageUrl = null;
    if (image instanceof File) {
      const uploadedImage = await storage.createFile(
        import.meta.env.VITE_APPWRITE_BUCKET_ID,
        ID.unique(),
        image
      );
      imageUrl = storage.getFileView(import.meta.env.VITE_APPWRITE_BUCKET_ID, uploadedImage.$id);
    }

    // Create Manufacturer in Appwrite database
    await databases.createDocument(
      import.meta.env.VITE_APPWRITE_DATABASE_ID,
      import.meta.env.VITE_APPWRITE_MANUFACTURERS_COLLECTION_ID,
      ID.unique(),
      {
        manufacturer_title: name,
        manufacturer_top: top,
        manufacturer_image: imageUrl, // ✅ Save video URL
      }
    );
  } catch (error) {
    console.error("Error adding manufacturer:", error);
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
    console.log("Final data being sent to Appwrite:", {//+
      name,//+
      price,//+
      pspPrice,//+
      description,//+
      features,//+
      keywords,//+
      label,//+
      status,//+
      productUrl,//+
      images,//+
      video,//+
      categoryId,//+
      pCatId,//+
      manufacturerId//+
    }); // ✅ Debugging log
    // Ensure `features` is stored as an array
    const featuresArray = Array.isArray(features) ? features : features.split(",").map((f) => f.trim());

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
        cat_id: categoryId ?? null, 
        p_cat_id: pCatId ?? null,
        manufacturer_id: manufacturerId ?? null,
        created_at: new Date().toISOString(),
      }
    );

    console.log("Product successfully added:", Response); // ✅ Debugging log
    return Response;
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
    console.log("Fetched Products:", products.documents);

    return products.documents.map(product => ({
      ...product,
      cat_id: product.cat_id ? { $id: product.cat_id.$id, cat_title: product.cat_id.cat_title } : null,
      p_cat_id: product.p_cat_id ? { $id: product.p_cat_id.$id, p_cat_title: product.p_cat_id.p_cat_title } : null,
      manufacturer_id: product.manufacturer_id ? { $id: product.manufacturer_id.$id, manufacturer_title: product.manufacturer_id.manufacturer_title } : null,
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
        admin_country: admin.admin_country,
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

// Images & Video
export const addImages = async ({
  images,
  video,
}: ProductData) => {
  try {
    console.log("Final data being sent to Appwrite:", {//+
      images,//+
      video,//+
    }); // ✅ Debugging log

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
        product_img1: uploadedImages[0] || null,
        product_img2: uploadedImages[1] || null,
        product_img3: uploadedImages[2] || null,
        product_video: videoUrl, // ✅ Save video URL
        created_at: new Date().toISOString(),
      }
    );

    console.log("Product successfully added:", Response); // ✅ Debugging log
    return Response;
  } catch (error) {
    console.error("Error adding product:", error);
  }
};

// Fetch and Display Product Categories
export async function displayProductCategories() {
  try {
    const pCat = await databases.listDocuments(
      import.meta.env.VITE_APPWRITE_DATABASE_ID,
      import.meta.env.VITE_APPWRITE_PRODUCT_CATEGORIES_COLLECTION_ID
    );

    return pCat.documents.map(pCat => ({
      ...pCat,
      p_cat_title: pCat.p_cat_title || '',
      p_cat_image: pCat.p_cat_image || '',
    }));
  } catch (error) {
    console.error('Error fetching product categories:', error);
    return [];
  }
};

// Fetch and Display Manufacturers
export async function displayManufacturers() {
  try {
    const man = await databases.listDocuments(
      import.meta.env.VITE_APPWRITE_DATABASE_ID,
      MF_ID
    );

    return man.documents.map(man => ({
      ...man,
      manufacturer_title: man.manufacturer_title || '',
      manufacturer_image: man.manufacturer_image || '',
    }));
  } catch (error) {
    console.error('Error fetching Manufacturers:', error);
    return [];
  }
};

// Search Function
// export const searchProducts = async (query: string) => {
//   try {
//     console.log("Querying database with:", query);

//       const searchQueries = [
//             Query.equal("product_title", query), // Exact match test
//             Query.equal("product_keywords", query),
//             Query.equal("cat_id", query),
//             Query.equal("manufacturer_id", query),
//             Query.equal("p_cat_id", query),
//           ];
  
//       const response = await databases.listDocuments(
//         import.meta.env.VITE_APPWRITE_DATABASE_ID!,
//         import.meta.env.VITE_APPWRITE_PRODUCTS_COLLECTION_ID!,
//         searchQueries // Pass as an array
//       );

//     console.log("API Response:", response.documents);
  
//       return response.documents;
//     } catch (error) {
//       console.error("Search error:", error);
//       return [];
//     }
// };

export const getProductsByManufacturer = async (manufacturerId: string) => {
  try {
    const response = await databases.listDocuments(
      DB_ID,
      PD_ID!,
      [
        Query.equal("manufacturer_id", manufacturerId),
      ]
    );
    return response.documents;
  } catch (error) {
    console.error("Error fetching products by manufacturer:", error);
    return [];
  }
};

export const getProductsByProductCategory = async (pCatId: string) => {
  try {
    const response = await databases.listDocuments(
      DB_ID,
      PD_ID!,
      [Query.equal("p_cat_id", pCatId)] // Ensure "category_id" matches your schema
    );
    return response.documents;
  } catch (error) {
    console.error("Error fetching products by product category:", error);
    return [];
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