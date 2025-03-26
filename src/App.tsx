import { Routes, Route } from "react-router-dom";
import Home from "./_root/pages/Home";
import Products from "./_root/pages/Products";
import SigninForm from "./_auth/forms/SigninForm";
import SignupForm from "./_auth/forms/SignupForm";
import AdminRoute from "./_root/admin/AdminRoute";
import AdminDashboard from "./_root/admin/pages/AdminDashboard";
import { ThemeProvider } from "./components/theme-provider";
import RootLayout from "./_root/RootLayout";
import ProductDetails from "./_root/pages/ProductDetails";
import AuthLayout from "./_auth/AuthLayout";
import AdminLayout from "./_root/admin/AdminLayout";
import DashboardContent from "./_root/admin/pages/DashboardContent";
import { DataFetch } from "./_root/admin/pages/DataFetch";
import { PostForm } from "./components/shared/Forms/PostForm";
import { AddForm } from "./components/shared/Forms/AddForm";
import { AddImages } from "./components/shared/Forms/AddImages";
import { Database } from "./_root/admin/pages/Database";
import Profile from "./_root/admin/pages/Profile";

function App() {
  return (
    <>
    <main>
      <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
        <Routes>
          {/* public routes */}
          <Route element={<RootLayout/>}>
            <Route index element={<Home />} />
            <Route path="/products" element={<Products />} />
            <Route path="/product/:id" element={<ProductDetails />} />
          </Route>

          {/* private routes */}
          <Route element={<AuthLayout />}>
            <Route path="/login" element={<SigninForm />} />
            <Route path="/signup" element={<SignupForm />} />
          </Route>

          {/* Admin routes */}
          <Route element={<AdminLayout />}>
            <Route path="/admin-dashboard" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
            <Route path="/add-product" element={<PostForm />} />
            <Route path="/add-form" element={<AddForm />} />
            <Route path="/dashboard" element={<DashboardContent />} />
            <Route path="/add-image" element={<AddImages />} />
            <Route path="/account" element={<Profile />} />
            <Route path="/users" element={<Database />} />
            <Route path="/view-products" element={<Database />} />
            <Route path="/view-orders" element={<DataFetch />} />
          </Route>
        </Routes>
      </ThemeProvider>
    </main>
    </>
  );
}

export default App;
