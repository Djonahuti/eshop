import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { addCategory } from "@/lib/appwrite";

export const CategoryForm = () => {
  const [name, setName] = useState("");
  const [top, setTop] = useState(false);
  const [image, setImage] = useState<File | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) setImage(e.target.files[0]);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await addCategory({ name, top, image });
    toast("Category added successfully!");
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-6 bg-white shadow rounded-lg">
      <div>
        <Label>Category Name</Label>
        <Input value={name} onChange={(e) => setName(e.target.value)} required />
      </div>
      <div>
        <Label>Top Category?</Label>
        <input type="checkbox" checked={top} onChange={() => setTop(!top)} />
      </div>
      <div>
        <Label>Category Image</Label>
        <Input type="file" accept="image/*" onChange={handleFileChange} />
      </div>
      <Button type="submit">Add Category</Button>
    </form>
  );
};
