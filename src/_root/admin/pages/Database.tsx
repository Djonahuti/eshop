import { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getOrders, getProducts, updateOrderStatus, getUsers, deleteProduct, deleteUser } from "@/lib/appwrite";
import { Button } from "@/components/ui/button";
import { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "@/components/shared/data-table";

interface Order {
  id: string;
  customerName: string;
  status: string;
}

interface Product {
  $id: string;
  product_title: string;
  product_price: number;
  product_desc: string;
  product_features: string[];
  product_label: string;
  product_img1: string;
  product_video?: string;
  cat_id?: { cat_title: string }[];
  p_cat_id?: { p_cat_title: string }[];
  manufacturer_id?: { manufacturer_title: string }[];
}

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  profileImage: string;
}

export const Database = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  
  useEffect(() => {
    getOrders().then(setOrders);
    getProducts().then(setProducts);
    getUsers().then(setUsers);
  }, []);

  const handleUpdateOrderStatus = async (id: string, status: string) => {
    await updateOrderStatus(id, status);
    getOrders().then(setOrders);
  };

  const handleDeleteProduct = async (id: string) => {
    await deleteProduct(id);
    setProducts((prev) => prev.filter((product) => product.$id !== id));
  };

  const handleDeleteUser = async (id: string) => {
    await deleteUser(id);
    setUsers((prev) => prev.filter((user) => user.id !== id));
  };

  const orderColumns: ColumnDef<Order>[] = [
    { accessorKey: "id", header: "Order ID" },
    { accessorKey: "customerName", header: "Customer" },
    { accessorKey: "status", header: "Status" },
    {
      accessorKey: "actions",
      header: "Actions",
      cell: ({ row }) => (
        <Button onClick={() => handleUpdateOrderStatus(row.original.id, "Shipped")}>Mark as Shipped</Button>
      ),
    },
  ];

  const productColumns: ColumnDef<Product>[] = [
    { accessorKey: "product_title", header: "Title" },
    { accessorKey: "product_price", header: "Price" },
    { accessorKey: "product_desc", header: "Description" },
    { accessorKey: "product_features", header: "Features" },
    { accessorKey: "product_label", header: "Label" },
    {
      accessorKey: "cat_id",
      header: "Categories",
      cell: ({ row }) => row.original.cat_id?.cat_title || "Unknown",
    },
    {
      accessorKey: "p_cat_id",
      header: "Product Categories",
      cell: ({ row }) => row.original.p_cat_id?.p_cat_title || "Unknown",
    },
    {
      accessorKey: "manufacturer_id",
      header: "Manufacturers",
      cell: ({ row }) => row.original.manufacturer_id?.manufacturer_title || "Unknown",
    },
    {
      accessorKey: "product_img1",
      header: "Image",
      cell: ({ row }) => <img src={row.original.product_img1} alt="Product" width="50" />,
    },
    {
      accessorKey: "actions",
      header: "Actions",
      cell: ({ row }) => (
        <Button onClick={() => handleDeleteProduct(row.original.$id)} variant="destructive">Delete</Button>
      ),
    },
  ];

  const userColumns: ColumnDef<User>[] = [
    { accessorKey: "name", header: "Name" },
    { accessorKey: "email", header: "Email" },
    {
      accessorKey: "role",
      header: "Role",
      cell: ({ row }) => <span className={row.original.role === "admin" ? "text-red-500" : "text-blue-500"}>{row.original.role}</span>,
    },
    {
      accessorKey: "profileImage",
      header: "Profile Photo",
      cell: ({ row }) => (
        row.original.profileImage ? (
          <img src={row.original.profileImage} alt={row.original.name} className="w-10 h-10 rounded-full border" />
        ) : ("No Image")
      ),
    },
    {
      accessorKey: "actions",
      header: "Actions",
      cell: ({ row }) => (
        <Button onClick={() => handleDeleteUser(row.original.id)} variant="destructive">Delete</Button>
      ),
    },
  ];

  return (
    <div className="flex flex-1 flex-col">
    <div className="@container/main flex flex-1 flex-col gap-2">
        <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
          <Tabs defaultValue="orders">
            <TabsList>
              <TabsTrigger value="orders">Orders</TabsTrigger>
              <TabsTrigger value="products">Products</TabsTrigger>
              <TabsTrigger value="users">Users</TabsTrigger>
            </TabsList>
            <TabsContent value="orders">
              <DataTable columns={orderColumns} data={orders} />
            </TabsContent>
            <TabsContent value="products">
              <DataTable columns={productColumns} data={products} />
            </TabsContent>
            <TabsContent value="users">
              <DataTable columns={userColumns} data={users} />
            </TabsContent>
          </Tabs>
        </div>
    </div>
    </div>
  );
};
