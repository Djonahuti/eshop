import { Client, Account, Databases, Storage, ID, Query } from "appwrite";

// Initialize Appwrite Client
const client = new Client();
client
  .setEndpoint(import.meta.env.VITE_APPWRITE_ENDPOINT)
  .setProject(import.meta.env.VITE_APPWRITE_PROJECT_ID);

const account = new Account(client);
const database = new Databases(client);
const storage = new Storage(client);

const DB_ID = import.meta.env.VITE_APPWRITE_DATABASE_ID;
const STORAGE_BUCKET_ID = import.meta.env.VITE_APPWRITE_BUCKET_ID;
const ADMIN_COLLECTION_ID = import.meta.env.VITE_APPWRITE_ADMIN_COLLECTION_ID;
const PRODUCTS_COLLECTION_ID = import.meta.env.VITE_APPWRITE_PRODUCTS_COLLECTION_ID;
const CUSTOMERS_COLLECTION_ID = import.meta.env.VITE_APPWRITE_CUSTOMERS_COLLECTION_ID;
const ORDERS_COLLECTION_ID = import.meta.env.VITE_APPWRITE_ORDERS_COLLECTION_ID;

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

/* ==========================
   📦 FILE UPLOAD FUNCTIONS
   ========================== */
// Upload File to Storage
export const uploadFile = async (file: File) => {
  try {
    const response = await storage.createFile(STORAGE_BUCKET_ID, ID.unique(), file);
    return response.$id; // Returns the file ID
  } catch (error) {
    console.error("Error uploading file:", error);
    return null;
  }
};

// Get File URL
export const getFileUrl = (fileId: string) => {
  return storage.getFileView(STORAGE_BUCKET_ID, fileId);
};

/* ==========================
   🏷️ CATEGORY FUNCTIONS
   ========================== */
export const addCategory = async (category: { title: string; top?: boolean; image?: File }) => {
  try {
    let imageId = null;
    if (category.image) {
      imageId = await uploadFile(category.image);
      if (!imageId) throw new Error("Category image upload failed");
    }

    return await database.createDocument(DB_ID, "categories", ID.unique(), {
      title: category.title,
      top: category.top || false,
      image: imageId,
    });
  } catch (error) {
    console.error("Error adding category:", error);
  }
};

//Fetch categories
export const getCategories = async () => {
  try {
    const response = await database.listDocuments(
      import.meta.env.VITE_APPWRITE_DATABASE_ID,
      import.meta.env.VITE_APPWRITE_CATEGORIES_COLLECTION_ID
    );

    return response.documents.map((doc) => ({
      id: doc.$id,
      name: doc.cat_title, // Make sure `category_name` matches your database field
    }));
  } catch (error) {
    console.error("Error fetching categories:", error);
    return [];
  }
};

// Fetch Product Categories
export const getProductCategories = async () => {
  try {
    const response = await database.listDocuments(
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
   🏭 MANUFACTURERS FUNCTIONS
   ========================== */
export const addManufacturer = async (manufacturer: { title: string; top?: boolean; image?: File }) => {
  try {
    let imageId = null;
    if (manufacturer.image) {
      imageId = await uploadFile(manufacturer.image);
      if (!imageId) throw new Error("Manufacturer image upload failed");
    }

    return await database.createDocument(DB_ID, "manufacturers", ID.unique(), {
      title: manufacturer.title,
      top: manufacturer.top || false,
      image: imageId,
    });
  } catch (error) {
    console.error("Error adding manufacturer:", error);
  }
};

// Fetch Manufacturers
export const getManufacturers = async () => {
  try {
    const response = await database.listDocuments(
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
    await database.createDocument(
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

// Fetch Products
export const getProducts = async () => {
  try {
    const categoryList = await getCategories(); // Fetch categories

    console.log("Fetched Categories:", categoryList); // Debugging

    // Create category map { category_id: category_name }
    const categoryMap: Record<string, string> = categoryList.reduce(
      (map, category) => {
        map[category.id] = category.name;
        return map;
      },
      {} as Record<string, string>
    );

    console.log("Category Map:", categoryMap); // Debugging

    const response = await database.listDocuments(DB_ID, PRODUCTS_COLLECTION_ID);
    return response.documents.map((doc) => {
      let categoryIds: string[] = [];

      // Ensure `cat_id` is treated as an array
      if (Array.isArray(doc.cat_id)) {
        categoryIds = doc.cat_id;
      } else if (typeof doc.cat_id === "string") {
        categoryIds = [doc.cat_id];
      }

      console.log("Category IDs for Product:", doc.product_title, categoryIds); // Debugging

      return {
        id: doc.$id,
        name: doc.product_title,
        price: doc.product_price,
        pspPrice: doc.product_psp_price,
        description: doc.product_desc,
        features: doc.product_features,
        keywords: doc.product_keywords,
        label: doc.product_label,
        status: doc.status,
        productUrl: doc.product_url,
        images: [doc.product_img1, doc.product_img2, doc.product_img3].filter(Boolean),
        video: doc.product_video,
        categories: categoryIds.map((catId: string) => ({
          id: catId,
          name: categoryMap[catId] || "Unknown Category",
        })),
        pCatId: doc.p_cat_id,
        manufacturerId: doc.manufacturer_id,
        createdAt: doc.created_at,
      };
    }); // Ensure it returns only the documents array
  } catch (error) {
    console.error("Error fetching products:", error);
    return []; // Prevent crash if request fails
  }
};

// Delete Product
export const deleteProduct = async (productId: string) => {
  try {
    return await database.deleteDocument(DB_ID, "products", productId);
  } catch (error) {
    console.error("Error deleting product:", error);
  }
};

/* ==========================
   🛒 CART FUNCTIONS
   ========================== */
export const addToCart = async (cartItem: { ip_add: string; p_id: string; qty: number; size: string; price: number }) => {
  try {
    return await database.createDocument(DB_ID, "cart", ID.unique(), cartItem);
  } catch (error) {
    console.error("Error adding to cart:", error);
  }
};

/* ==========================
   ❤️ WISHLIST FUNCTIONS
   ========================== */
export const addToWishlist = async (wishlistItem: { customer_id: string; product_id: string }) => {
  try {
    return await database.createDocument(DB_ID, "wishlist", ID.unique(), wishlistItem);
  } catch (error) {
    console.error("Error adding to wishlist:", error);
  }
};

/* ==========================
   🎟️ COUPON FUNCTIONS
   ========================== */
export const applyCoupon = async (couponCode: string) => {
  try {
    const coupons = await database.listDocuments(DB_ID, "coupons");
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
    return await database.createDocument(DB_ID, "payments", ID.unique(), paymentData);
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
    const response = await database.listDocuments(DB_ID, ORDERS_COLLECTION_ID);
    return response.documents || []; // Ensure it returns only the documents array
  } catch (error) {
    console.error("Error fetching orders:", error);
    return []; // Prevent crash if request fails
  }
};

// Update Order Status
export const updateOrderStatus = async (orderId: string, status: string) => {
  try {
    return await database.updateDocument(DB_ID, "orders", orderId, { status });
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
    const customers = await database.listDocuments(DB_ID, CUSTOMERS_COLLECTION_ID);

    // Fetch admins
    const admins = await database.listDocuments(DB_ID, ADMIN_COLLECTION_ID);

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
    const customerQuery = await database.listDocuments(
      import.meta.env.VITE_APPWRITE_DATABASE_ID,
      import.meta.env.VITE_APPWRITE_CUSTOMERS_COLLECTION_ID,
      [Query.equal("customer_email", email)]
    );

    if (customerQuery.documents.length > 0) {
      return customerQuery.documents[0].customer_image;
    }

    // Check if user is an admin
    const adminQuery = await database.listDocuments(
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
    return await database.deleteDocument(DB_ID, "customers", userId);
  } catch (error) {
    console.error("Error deleting user:", error);
  }
};