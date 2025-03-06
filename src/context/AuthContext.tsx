import { createContext, useContext, useEffect, useState } from 'react';
import { Models } from 'appwrite';
import { account, databases } from '@/lib/apprite';
import { ID } from 'appwrite';

interface AuthContextType {
  user: Models.User<Models.Preferences> | null;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string, firstName: string, lastName: string, phone: string, address: string, city: string, country: string, zipCode: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<Models.User<Models.Preferences> | null>(null);

  useEffect(() => {
    account.get().then(setUser).catch(() => setUser(null));
  }, []);

  const login = async (email: string, password: string) => {
    await account.createEmailPasswordSession(email, password);
    const user = await account.get();
    setUser(user);
  };

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
    try {
      // Step 1: Create user in authentication
      await account.create(ID.unique(), email, password, firstName);
  
      // Step 2: Save user details in the "customers" collection
      await databases.createDocument(
        import.meta.env.VITE_APPWRITE_DATABASE_ID,
        import.meta.env.VITE_APPWRITE_CUSTOMERS_COLLECTION_ID, // Ensure this is in your .env
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
        }
      );
    } catch (error) {
      console.error("Signup Error:", error);
      throw error; // Ensure errors still propagate
    }
  };
  

  const logout = async () => {
    await account.deleteSession('current');
    setUser(null);
  };

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
