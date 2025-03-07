import { createContext, useContext, useEffect, useState } from 'react';
import { Client, Account, ID, Databases, Query, Models } from "appwrite";
import { useNavigate } from 'react-router-dom';

// Define AuthUser interface to include role
interface AuthUser extends Models.User<Models.Preferences> {
  role?: "admin" | "customer";
}

// Define AuthContext interface
interface AuthContextType {
  user: AuthUser | null;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string, firstName: string, lastName: string, phone: string, address: string, city: string, country: string, zipCode: string) => Promise<void>;
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

  // Function to handle login
const login = async (email: string, password: string): Promise<void> => {
  try {
    // Step 1: Log in user with Appwrite authentication
    await account.createEmailPasswordSession(email, password);
    const user = await account.get(); // Get logged-in user details

    // Step 2: Check if user exists in the "admins" collection
    const adminQuery = await databases.listDocuments(
      import.meta.env.VITE_APPWRITE_DATABASE_ID,
      import.meta.env.VITE_APPWRITE_ADMIN_COLLECTION_ID, // Admin Collection ID
      [Query.equal("email", email)]
    );

    // Step 3: Determine role and update state
    const role = adminQuery.documents.length > 0 ? "admin" : "customer";

    setUser({ ...user, role }); // Store user role
    navigate(role === "admin" ? "/admin-dashboard" : "/dashboard"); // Redirect accordingly
  } catch (error) {
    console.error("Login Error:", error);
    throw error;
  }
};

  
  // Function to handle signup
  const signup = async (
    email: string,
    password: string,
    firstName: string,
    lastName: string,
    phone: string,
    address: string,
    city: string,
    country: string,
    zipCode: string
  ): Promise<void> => {
    // Step 1: Create user in authentication
    try {
      // Step 1: Create user in authentication
      const user = await account.create(ID.unique(), email, password, firstName);
      if (!user) throw new Error("Failed to create user.");

      // Save user data to the "customers" collection
      await databases.createDocument(
        import.meta.env.VITE_APPWRITE_DATABASE_ID,
        import.meta.env.VITE_APPWRITE_CUSTOMERS_COLLECTION_ID,
        ID.unique(),
        {
          first_name: firstName,
          last_name: lastName,
          email: email,
          password: password,
          phone: phone,
          address: address,
          city: city,
          country: country,
          zip_code: zipCode,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
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
        setUser(user);
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

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
