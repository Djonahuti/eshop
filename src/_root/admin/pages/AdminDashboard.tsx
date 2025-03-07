import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAppwrite } from "@/lib/apprite";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function AdminDashboard() {
  const { addProduct, getCategories, getSubCategories } = useAppwrite();
    const [name, setName] = useState("");
    const [price, setPrice] = useState("");
    const [categoryId, setCategoryId] = useState("");
    const [subCategoryId, setSubCategoryId] = useState("");
    const [images, setImages] = useState<File[]>([]);
    const [categories, setCategories] = useState<{ $id: string; name: string }[]>([]);
    const [subCategories, setSubCategories] = useState<{ $id: string; name: string }[]>([]);
    
      useEffect(() => {
        // Fetch categories and subcategories on load
        getCategories().then((data) => setCategories(data));
        getSubCategories().then((data) => setSubCategories(data));
      }, []);

      const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
          setImages(Array.from(e.target.files).slice(0, 4)); // Allow max 4 images
        }
      };

      const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!name || !price || !categoryId || !subCategoryId || images.length < 1) return;
    
        await addProduct({ name, price, images, categoryId, subCategoryId });
        setName("");
        setPrice("");
        setCategoryId("");
        setSubCategoryId("");
        setImages([]);
      };
      
        return (
          <div className="p-6">
            <Card>
              <CardHeader>
                <CardTitle>Add Product</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <Input placeholder="Product Name" value={name} onChange={(e) => setName(e.target.value)} />
                  <Input placeholder="Price" type="number" value={price} onChange={(e) => setPrice(e.target.value)} />
      
                  {/* Category Dropdown */}
                  <Select value={categoryId} onValueChange={setCategoryId}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select Category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category.$id} value={category.$id}>
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
      
                  {/* Subcategory Dropdown */}
                  <Select value={subCategoryId} onValueChange={setSubCategoryId}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select Subcategory" />
                    </SelectTrigger>
                    <SelectContent>
                      {subCategories.map((sub) => (
                        <SelectItem key={sub.$id} value={sub.$id}>
                          {sub.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
      
                  {/* Image Upload */}
                  <Input type="file" multiple onChange={handleImageUpload} />
                  <p>Selected Images: {images.length} (Max: 4)</p>
      
                  <Button type="submit">Add Product</Button>
                </form>
              </CardContent>
            </Card>
          </div>
        );
}
