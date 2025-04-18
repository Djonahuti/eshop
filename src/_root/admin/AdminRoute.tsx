import { useAuth } from "@/context/AuthContext";
import { Navigate } from "react-router-dom";

const AdminRoute = ({ children }: { children: React.ReactNode }) => {
  const { user } = useAuth();

  if (!user || user.role !== "admin") {
    return <Navigate to="/login" />;
  }

  return children;
};

export default AdminRoute;
