import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { ProductForm } from "./forms/ProductForm";
import { getProducts, deleteProduct } from "@/lib/appwriteService";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export const ProductsPage = () => {
  const [products, setProducts] = useState<{ id: string; name: string; price: number; description: string; features: string; label: string; images: string[]; video: string; categories: { id: string; name: string }[]; }[]>([]);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    const loadProducts = async () => {
      const data = await getProducts();
      if (data.length === 0) {
        console.warn("No products found.");
      }
      setProducts(data || []);
    };
    loadProducts();
  }, []);

  const handleDelete = async (id: string) => {
    await deleteProduct(id);
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Manage Products</h2>
      <Button onClick={() => setShowForm(!showForm)}>{showForm ? "Close Form" : "Add Product"}</Button>
      {showForm && <ProductForm />}

      <Table className="mt-6">
        <TableHeader>
          <TableRow>
            <TableHead>ID</TableHead>
            <TableHead>Title</TableHead>
            <TableHead>Price</TableHead>
            <TableHead>Description</TableHead>
            <TableHead>Features</TableHead>
            <TableHead>Label</TableHead>
            <TableHead>Category</TableHead>
            <TableHead>Images</TableHead>
            <TableHead>Video</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {products.map((product, index) => (
            <TableRow key={product.id || index}>
              <TableCell>{product.id}</TableCell>
              <TableCell>{product.name}</TableCell>
              <TableCell>{product.price}</TableCell>
              <TableCell>{product.description}</TableCell>
              <TableCell>{product.features}</TableCell>
              <TableCell>{product.label}</TableCell>
              <TableCell>{product.categories.map((cat) => cat.name).join(", ")}</TableCell>
              <TableCell>
                        {product.images.map((img, index) => (
                          <img key={index} src={img} alt="Product" width="50" />
                        ))}
              </TableCell>
              <TableCell>
                        {product.video ? <a href={product.video} target="_blank">View Video</a> : "No Video"}
              </TableCell>
              <TableCell>
                <Button onClick={() => handleDelete(product.id)} variant="destructive">Delete</Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};
