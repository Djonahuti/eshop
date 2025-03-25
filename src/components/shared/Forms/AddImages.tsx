import { useState } from "react";

import { ImagePlus } from "lucide-react";
import { addImages } from "@/lib/appwrite";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import FileUploader from "../FileUploader";
import { Button } from "@/components/ui/button";

export function AddImages() {
  const [images, setImages] = useState<File[]>([]);
  const [video, setVideo] = useState<File | null>(null); // State for video file
  const [error, setError] = useState<string | null>(null);

  // const handleSubmit = async (e: React.FormEvent) => {
  //   e.preventDefault();
  //   setError(null);

  //   if (!name || !price || !pspPrice || !description || !features || !keywords || !label || !productUrl || !categoryId || !pCatId || !manufacturerId || images.length < 1) {
  //     setError("All fields are required, including at least one image.");
  //     return;
  //   }

  //   try {
  //     await addProduct({
  //       name,
  //       price: parseFloat(price),
  //       pspPrice: parseFloat(pspPrice),
  //       description,
  //       features,
  //       keywords,
  //       label,
  //       status: "active",
  //       productUrl,
  //       images: images.map((img) => img.file), // Pass file objects
  //       video: video ? video.file : undefined, // Pass video file
  //       cat_id: categoryId, // Updated to match new schema
  //       p_cat_id: pCatId,
  //       manufacturer_id: manufacturerId,
  //     });

  //     // Reset form
  //     setName("");
  //     setPrice("");
  //     setPspPrice("");
  //     setDescription("");
  //     setFeatures("");
  //     setKeywords("");
  //     setLabel("");
  //     setProductUrl("");
  //     setCategoryId("");
  //     setPCatId("");
  //     setManufacturerId("");
  //     setImages([]);
  //     setVideo(null);
  //   } catch (err) {
  //     setError("Failed to add product. Please try again.");
  //     console.error(err);
  //   }
  // };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
  
    if (images.length < 1) {
      setError("All fields are required, including at least one image.");
      return;
    }
  
    const productData = {
      
      images: images.map((img) => img.file),
      video: video ? video.file : undefined,
    };
  
    console.log("Submitting Product Data:", productData); // Debugging Log
  
    try {
      await addImages(productData);
      console.log("Product Submitted Successfully!");
  
      // Reset form
      setImages([]);
      setVideo(null);
    } catch (err) {
      setError("Failed to add product. Please try again.");
      console.error(err);
    }
  };

  return (
    <div className="p-6">
        <Card>
            <CardHeader className="flex items-center gap-2 self-center font-medium">
                <CardTitle className="flex items-center justify-center"><ImagePlus />Add Images</CardTitle>
            </CardHeader>
            <CardContent>
    <form onSubmit={handleSubmit} className="space-y-4 p-6 shadow rounded-lg">
      {error && <p className="text-red-500">{error}</p>}

      <FileUploader accept="image/*" multiple onUpload={setImages} />
      <FileUploader accept="video/*" onUpload={(files) => setVideo(files[0] || null)} />

      <Button type="submit">Add Images</Button>
    </form>
            </CardContent>
        </Card>
    </div>
  );
};

