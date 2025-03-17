import { createContext, useContext, useEffect, useState } from 'react';
import { Client, Account, ID, Databases, Storage, Query, Models } from "appwrite";
import { useNavigate } from 'react-router-dom';

// Define AuthUser interface to include role
interface AuthUser extends Models.User<Models.Preferences> {
  role?: "admin" | "customer";
}

// Define AuthContext interface
interface AuthContextType {
  user: AuthUser | null;
  login: (email: string, password: string) => Promise<void>;
  signup: (
    email: string,
    password: string,
    customerName: string,
    phone: string,
    address: string,
    city: string,
    country: string,
    customerImage: File | null
  ) => Promise<void>;
  logout: () => Promise<void>;
}

// Create AuthContext with default values
const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const navigate = useNavigate();

  // Initialize Appwrite client
  const client = new Client()
    .setEndpoint(import.meta.env.VITE_APPWRITE_ENDPOINT)
    .setProject(import.meta.env.VITE_APPWRITE_PROJECT_ID);

  const account = new Account(client);
  const databases = new Databases(client);
  const storage = new Storage(client);

  // Function to handle login
const login = async (email: string, password: string): Promise<void> => {
  try {
    // Step 1: Logout any existing session to prevent conflicts
    await account.deleteSession("current");
    
    // Step 1: Log in user with Appwrite authentication
    await account.createEmailPasswordSession(email, password);
    const user = await account.get(); // Get logged-in user details

    // Step 2: Check if user exists in the "admins" collection
    const adminQuery = await databases.listDocuments(
      import.meta.env.VITE_APPWRITE_DATABASE_ID,
      import.meta.env.VITE_APPWRITE_ADMIN_COLLECTION_ID, // Admin Collection ID
      [Query.equal("admin_email", email)]
    );

    // Step 3: Determine role and update state
    const role = adminQuery.documents.length > 0 ? "admin" : "customer";

    setUser({ ...user, role }); // Store user role
    navigate(role === "admin" ? "/admin-dashboard" : "/"); // Redirect accordingly
  } catch (error) {
    console.error("Login Error:", error);
    throw error;
  }
};

  
  // Function to handle signup
  const signup = async (
    email: string,
    password: string,
    customerName: string,
    phone: string,
    address: string,
    city: string,
    country: string,
    customerImage: File | null
  ): Promise<void> => {
    // Step 1: Create user in authentication
    try {
      // Step 1: Create user in authentication
      const user = await account.create(ID.unique(), email, password, customerName);
      if (!user) throw new Error("Failed to create user.");

      let imageUrl = null;
  
      // Step 2: Upload profile image to Appwrite storage (if exists)
      if (customerImage) {
        const uploaded = await storage.createFile(
          import.meta.env.VITE_APPWRITE_BUCKET_ID,
          ID.unique(),
          customerImage
        );
        imageUrl = storage.getFileView(import.meta.env.VITE_APPWRITE_BUCKET_ID, uploaded.$id);
      }

      // Save user data to the "customers" collection
      await databases.createDocument(
        import.meta.env.VITE_APPWRITE_DATABASE_ID,
        import.meta.env.VITE_APPWRITE_CUSTOMERS_COLLECTION_ID,
        ID.unique(),
        {
          customer_name: customerName,
          customer_email: email,
          password,
          customer_contact: phone,
          customer_address: address,
          customer_city: city,
          customer_country: country,
          customer_image: imageUrl || null,
          customer_ip: "", // You might want to capture this on the frontend
          customer_confirm_code: ID.unique(), // Generate a random unique code
          created_at: new Date().toISOString(),
        }
      );

      // Auto-login after signup
      await login(email, password);
    } catch (error) {
      console.error("Signup Error:", error);
      throw error; // Ensure errors still propagate
    }
  };

  // Function to handle logout
  const logout = async () => {
    try {
      await account.deleteSession("current");
      setUser(null);
      navigate("/login");
    } catch (error) {
      console.error("Logout Error:", error);
      throw error;
    }
  };

  // Fetch user session on mount
  useEffect(() => {
    const getUser = async () => {
      try {
        const user = await account.get();

        // Fetch role from Admin collection
        const adminQuery = await databases.listDocuments(
          import.meta.env.VITE_APPWRITE_DATABASE_ID,
          import.meta.env.VITE_APPWRITE_ADMIN_COLLECTION_ID,
          [Query.equal("admin_email", user.email)]
        );
  
        // Determine role
        const role = adminQuery.documents.length > 0 ? "admin" : "customer";
  
        setUser({ ...user, role });
      } catch (error) {
        console.error("Session Error:", error);
        setUser(null);
      }
    };
    getUser();
  }, []);

  return (
    <AuthContext.Provider value={{ user, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook for AuthContext
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
