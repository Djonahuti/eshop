import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ProductsPage } from "./ProductsPage";
import { OrdersPage } from "./OrdersPage";
import { UsersPage } from "./UsersPage";
import { ProductForm } from "./forms/ProductForm";

export default function AdminDashboard() {
  const [activePage, setActivePage] = useState<"add-product" | "products" | "orders" | "users">("products");

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-900 text-white p-6">
        <h2 className="text-xl font-bold mb-6">Admin Dashboard</h2>
        <Button className="w-full mb-3" onClick={() => setActivePage("add-product")}>Add Product</Button>
        <Button className="w-full mb-3" onClick={() => setActivePage("products")}>Products</Button>
        <Button className="w-full mb-3" onClick={() => setActivePage("orders")}>Orders</Button>
        <Button className="w-full" onClick={() => setActivePage("users")}>Users</Button>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6">
        {activePage === "add-product" && <ProductForm />}
        {activePage === "products" && <ProductsPage />}
        {activePage === "orders" && <OrdersPage />}
        {activePage === "users" && <UsersPage />}
      </main>
    </div>
  );
};
