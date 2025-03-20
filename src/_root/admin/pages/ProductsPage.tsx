import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { ProductForm } from "./forms/ProductForm";
import { deleteProduct } from "@/lib/appwriteService";
import { ColumnDef } from "@tanstack/react-table";
import { getProducts } from "@/lib/appwrite";
import { DataTable } from "@/components/shared/data-table";

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

export const ProductsPage = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    getProducts().then((data) => {
      setProducts(data);
      setLoading(false);
    });
  }, []);

  const handleDelete = async (id: string) => {
    await deleteProduct(id);
    setProducts((prev) => prev.filter((product) => product.$id !== id));
  };

  const productColumns: ColumnDef<Product>[] = [
    { accessorKey: "product_title", header: "Title" },
    { accessorKey: "product_price", header: "Price" },
    { accessorKey: "product_desc", header: "Description" },
    { accessorKey: "product_features", header: "Features" },
    { accessorKey: "product_label", header: "Label" },
    {
      accessorKey: "cat_id",
      header: "Categories",
      cell: ({ row }) => row.original.cat_id?.[0]?.cat_title || "Unknown",
    },
    {
      accessorKey: "p_cat_id",
      header: "Product Categories",
      cell: ({ row }) => row.original.p_cat_id?.[0]?.p_cat_title || "Unknown",
    },
    {
      accessorKey: "manufacturer_id",
      header: "Manufacturers",
      cell: ({ row }) => row.original.manufacturer_id?.[0]?.manufacturer_title || "Unknown",
    },
    {
      accessorKey: "product_img1",
      header: "Image",
      cell: ({ row }) => <img src={row.original.product_img1} alt="Product" width="50" />,
    },
    {
      accessorKey: "product_video",
      header: "Video",
      cell: ({ row }) =>
        row.original.product_video ? <a href={row.original.product_video} target="_blank">View</a> : "No Video",
    },
    {
      accessorKey: "actions",
      header: "Actions",
      cell: ({ row }) => (
        <Button onClick={() => handleDelete(row.original.$id)} variant="destructive">
          Delete
        </Button>
      ),
    },
  ];

  if (loading) return <p>Loading products...</p>;

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Manage Products</h2>
      <Button onClick={() => setShowForm(!showForm)}>{showForm ? "Close Form" : "Add Product"}</Button>
      {showForm && <ProductForm />}
              <DataTable columns={productColumns} data={products} />
    </div>
  );
};
