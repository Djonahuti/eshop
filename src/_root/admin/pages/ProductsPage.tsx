import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { ProductForm } from "./forms/ProductForm";
import { deleteProduct } from "@/lib/appwriteService";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { getProducts } from "@/lib/appwrite";

export const ProductsPage = () => {
  const [products, setProducts] = useState<any[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    getProducts().then((data) => {
      setProducts(data);
      setLoading(false);
    });
  }, []);

  const handleDelete = async (id: string) => {
    await deleteProduct(id);
  };

  if (loading) return <p>Loading products...</p>;

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
            <TableHead>Product Category</TableHead>
            <TableHead>Brand</TableHead>
            <TableHead>Images</TableHead>
            <TableHead>Video</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {products.map((product, index) => (
            <TableRow key={product.$id || index}>
              <TableCell>{product.$id}</TableCell>
              <TableCell>{product.product_title}</TableCell>
              <TableCell>{product.product_price}</TableCell>
              <TableCell>{product.product_desc}</TableCell>
              <TableCell>{product.product_features}</TableCell>
              <TableCell>{product.product_label}</TableCell>
              <TableCell>{product.cat_id?.[0]?.cat_title}</TableCell>
              <TableCell>{product.p_cat_id?.[0]?.p_cat_title}</TableCell>
              <TableCell>{product.manufacturer_id?.[0]?.manufacturer_title}</TableCell>
              <TableCell>
              <img key={index} src={product.product_img1} alt="Product" width="50" />
              </TableCell>
              <TableCell>
                        {product.product_video ? <a href={product.product_video} target="_blank">View Video</a> : "No Video"}
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
