import { Routes, Route } from "react-router-dom";
import Home from "./_root/pages/Home";
import Products from "./_root/pages/Products";
import Navbar from "./components/shared/Navbar";
import Topbar from "./components/shared/Topbar";
import Bottombar from "./components/shared/Bottombar";
import SigninForm from "./_auth/forms/SigninForm";
import SignupForm from "./_auth/forms/SignupForm";
import AdminRoute from "./_root/admin/AdminRoute";
import AdminDashboard from "./_root/admin/pages/AdminDashboard";

function App() {
  return (
    <>
    <div className="hidden md:block"><Navbar /></div>
    <div className="md:hidden"><Topbar /></div>
    <Routes>
      <Route path="/signin" element={<SigninForm />} />
      <Route path="/signup" element={<SignupForm />} />
      <Route path="/admin-dashboard" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
      <Route path="/" element={<Home />} />
      <Route path="/products" element={<Products />} />
    </Routes>

    <Bottombar />
    </>
  );
}

export default App;
