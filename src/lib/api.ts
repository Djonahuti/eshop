import { Client, Databases, ID } from "appwrite";

const client = new Client();
client
  .setEndpoint(import.meta.env.VITE_APPWRITE_URL)
  .setProject(import.meta.env.VITE_APPWRITE_PROJECT_ID);

const database = new Databases(client);
const DB_ID = import.meta.env.VITE_APPWRITE_DATABASE_ID;

/* ==========================
   🚀 PRODUCTS FUNCTIONS 
   ========================== */
// Add Product
export const addProduct = async (product: {
  title: string;
  price: number;
  psp_price?: number;
  desc: string;
  features?: string;
  keywords?: string;
  label?: string;
  status: string;
  img1: string;
  img2?: string;
  img3?: string;
  video?: string;
  url: string;
  p_cat_id: string;
  cat_id: string;
  manufacturer_id: string;
}) => {
  try {
    const response = await database.createDocument(DB_ID, "products", ID.unique(), product);
    return response;
  } catch (error) {
    console.error("Error adding product:", error);
  }
};

// Fetch Products
export const getProducts = async () => {
  try {
    return await database.listDocuments(DB_ID, "products");
  } catch (error) {
    console.error("Error fetching products:", error);
  }
};

/* ==========================
   🏷️ CATEGORIES FUNCTIONS
   ========================== */
// Add Category
export const addCategory = async (category: { title: string; top?: boolean; image?: string }) => {
  try {
    return await database.createDocument(DB_ID, "categories", ID.unique(), category);
  } catch (error) {
    console.error("Error adding category:", error);
  }
};

// Fetch Categories
export const getCategories = async () => {
  try {
    return await database.listDocuments(DB_ID, "categories");
  } catch (error) {
    console.error("Error fetching categories:", error);
  }
};

/* ==========================
   🏭 MANUFACTURERS FUNCTIONS
   ========================== */
// Add Manufacturer
export const addManufacturer = async (manufacturer: { title: string; top?: boolean; image?: string }) => {
  try {
    return await database.createDocument(DB_ID, "manufacturers", ID.unique(), manufacturer);
  } catch (error) {
    console.error("Error adding manufacturer:", error);
  }
};

// Fetch Manufacturers
export const getManufacturers = async () => {
  try {
    return await database.listDocuments(DB_ID, "manufacturers");
  } catch (error) {
    console.error("Error fetching manufacturers:", error);
  }
};

/* ==========================
   🏷️ PRODUCT-CATEGORY RELATION
   ========================== */
export const addProductCategory = async (p_cat_id: string, cat_id: string) => {
  try {
    return await database.createDocument(DB_ID, "product_categories", ID.unique(), { p_cat_id, cat_id });
  } catch (error) {
    console.error("Error relating product to category:", error);
  }
};

/* ==========================
   🛒 CART FUNCTIONS
   ========================== */
// Add to Cart
export const addToCart = async (cartItem: { ip_add: string; p_id: string; qty: number; size: string; price: number }) => {
  try {
    return await database.createDocument(DB_ID, "cart", ID.unique(), cartItem);
  } catch (error) {
    console.error("Error adding to cart:", error);
  }
};

// Remove from Cart
export const removeFromCart = async (cartId: string) => {
  try {
    return await database.deleteDocument(DB_ID, "cart", cartId);
  } catch (error) {
    console.error("Error removing from cart:", error);
  }
};

/* ==========================
   ❤️ WISHLIST FUNCTIONS
   ========================== */
// Add to Wishlist
export const addToWishlist = async (wishlistItem: { customer_id: string; product_id: string }) => {
  try {
    return await database.createDocument(DB_ID, "wishlist", ID.unique(), wishlistItem);
  } catch (error) {
    console.error("Error adding to wishlist:", error);
  }
};

// Remove from Wishlist
export const removeFromWishlist = async (wishlistId: string) => {
  try {
    return await database.deleteDocument(DB_ID, "wishlist", wishlistId);
  } catch (error) {
    console.error("Error removing from wishlist:", error);
  }
};

/* ==========================
   🎟️ COUPON FUNCTIONS
   ========================== */
// Apply Coupon
export const applyCoupon = async (couponCode: string) => {
  try {
    const coupons = await database.listDocuments(DB_ID, "coupons");
    const coupon = coupons.documents.find((c) => c.coupon_code === couponCode);

    if (coupon) return coupon;
    else throw new Error("Invalid coupon");
  } catch (error) {
    console.error("Error applying coupon:", error);
  }
};

/* ==========================
   💳 PAYMENT FUNCTIONS
   ========================== */
// Process Payment
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
