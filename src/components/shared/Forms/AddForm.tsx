import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { addCategory, addManufacturer, addProductCategory } from "@/lib/appwrite";
import { PlusCircleIcon } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Loader2 } from 'lucide-react';

// Define form data types
type FormType = "category" | "manufacturer" | "productCategory";

type FormData = {
  name: string;
  top?: boolean;
  image?: File | null;
};

export const AddForm = () => {
  const [formType, setFormType] = useState<FormType>("category");
  const [formData, setFormData] = useState<FormData>({ name: "", top: false, image: null });
  const [isPending, setIsPending] = useState(false); // Added state for loading

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFormData((prev) => ({ ...prev, image: e.target.files[0] }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsPending(true); // Set loading state
    try {
      if (formType === "category") {
        await addCategory({ name: formData.name, top: formData.top ?? false, image: formData.image });
        toast("Category added successfully!");
      } else if (formType === "manufacturer") {
        await addManufacturer({ name: formData.name, top: formData.top ?? false, image: formData.image });
        toast("Manufacturer added successfully!");
      } else if (formType === "productCategory") {
        await addProductCategory({ name: formData.name, top: formData.top ?? false, image: formData.image });
        toast("Product Category added successfully!");
      }
      setFormData({ name: "", top: false, image: null });
    } catch (error) {
      toast("Error adding data.");
    } finally {
      setIsPending(false); // Reset loading state
    }
  };

  return (
    <div className="p-6">
      <Card>
        <CardHeader className="flex items-center gap-2 self-center font-medium">
          <CardTitle className="flex items-center justify-center"><PlusCircleIcon />Quick Create</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs value={formType} onValueChange={(value) => setFormType(value as FormType)}>
            <div className="flex justify-center items-center">
            <TabsList className="mb-4">
              <TabsTrigger value="category">Add Category</TabsTrigger>
              <TabsTrigger value="manufacturer">Add Manufacturer</TabsTrigger>
              <TabsTrigger value="productCategory">Add Product Category</TabsTrigger>
            </TabsList>
            </div>
  
            <form onSubmit={handleSubmit} className="space-y-4 p-6 shadow rounded-lg">
              <div className="space-y-2">
                <Label>Name</Label>
                <Input
                  value={formData.name}
                  onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label>Top?</Label>
                <input
                  type="checkbox"
                  checked={formData.top}
                  onChange={() => setFormData((prev) => ({ ...prev, top: !prev.top }))}
                />
              </div>
              <div className="space-y-2">
                <Label>Image</Label>
                <Input type="file" accept="image/*" onChange={handleFileChange} />
              </div>
              <Button type="submit" disabled={isPending}>
              {isPending && <Loader2 className="animate-spin mr-2" size={18} />}Add {formType === "category" ? "Category" : formType === "manufacturer" ? "Manufacturer" : "Product Category"}</Button>
            </form>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};
