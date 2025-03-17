import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { addProduct, getCategories, getProductCategories, getManufacturers } from "@/lib/appwrite";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export const ProductForm = () => {

  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [pspPrice, setPspPrice] = useState("");
  const [description, setDescription] = useState("");
  const [features, setFeatures] = useState("");
  const [keywords, setKeywords] = useState("");
  const [label, setLabel] = useState("");
  const [status, setStatus] = useState("active");
  const [productUrl, setProductUrl] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [pCatId, setPCatId] = useState("");
  const [manufacturerId, setManufacturerId] = useState("");
  const [images, setImages] = useState<File[]>([]);
  const [video, setVideo] = useState<File | null>(null); // State for video file
  const [categories, setCategories] = useState<{ $id: string; cat_title: string }[]>([]);
  const [productCategories, setProductCategories] = useState<{ $id: string; p_cat_title: string }[]>([]);
  const [manufacturers, setManufacturers] = useState<{ $id: string; manufacturer_title: string }[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (images.length > 3) {
      setImages(images.slice(0, 3)); // Restrict max 3 images
    }
  }, [images]);

  useEffect(() => {
    // Fetch categories, product categories, and manufacturers on load
    Promise.all([getCategories(), getProductCategories(), getManufacturers()])
      .then(([categories, productCategories, manufacturers]) => {
        setCategories(categories);
        setProductCategories(productCategories);
        setManufacturers(manufacturers);
      })
      .catch((err) => console.error("Error fetching data:", err));
  }, []);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setImages(Array.from(e.target.files).slice(0, 3)); // Limit to 3 images
    }
  };

  const handleVideoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setVideo(e.target.files[0]); // Set selected video file
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!name || !price || !pspPrice || !description || !features || !keywords || !label || !productUrl || !categoryId || !pCatId || !manufacturerId || images.length < 1) {
      setError("All fields are required, including at least one image.");
      return;
    }

    try {
      await addProduct({
        name,
        price: parseFloat(price),
        pspPrice: parseFloat(pspPrice),
        description,
        features,
        keywords,
        label,
        status,
        productUrl,
        images,
        video: video ? video : undefined, // ✅ Only pass video if it's valid
        categoryId,
        pCatId,
        manufacturerId,
      });

      // Reset form fields
      setName("");
      setPrice("");
      setPspPrice("");
      setDescription("");
      setFeatures("");
      setKeywords("");
      setLabel("");
      setStatus("active");
      setProductUrl("");
      setCategoryId("");
      setPCatId("");
      setManufacturerId("");
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
        <CardHeader>
          <CardTitle>Add Product</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4 p-6 bg-white shadow rounded-lg">
            {error && <p className="text-red-500">{error}</p>}
        <div>
          <Label>Product Name</Label>
          <Input value={name} onChange={(e) => setName(e.target.value)} required />
        </div>
        <div>
          <Label>Price</Label>
          <Input type="number" value={price} onChange={(e) => setPrice(e.target.value)} required />
        </div>
        <div>
          <Label>Slashed Price</Label>
          <Input type="number" value={pspPrice} onChange={(e) => setPspPrice(e.target.value)} required />
        </div>
        <div>
          <Label>Description</Label>
          <Textarea value={description} onChange={(e) => setDescription(e.target.value)} required />
        </div>
        <div>
          <Label>Features</Label>
          <Textarea value={features} onChange={(e) => setFeatures(e.target.value)} required />
        </div>
        <div>
          <Label>Keywords</Label>
          <Input value={keywords} onChange={(e) => setKeywords(e.target.value)} required />
        </div>
        <div>
          <Label>Label</Label>
          <Input value={label} onChange={(e) => setLabel(e.target.value)} required />
        </div>
        <div>
          <Label>Product URL</Label>
          <Input value={productUrl} onChange={(e) => setProductUrl(e.target.value)} required />
        </div>
        <div>

        {/* Category Dropdown */}
        <Select value={categoryId} onValueChange={setCategoryId}>
          <SelectTrigger>
            <SelectValue placeholder="Select Category" />
          </SelectTrigger>
          <SelectContent>
            {categories.map((category) => (
              <SelectItem key={category.$id} value={category.$id}>
                {category.cat_title}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Product Category Dropdown */}
        <Select value={pCatId} onValueChange={setPCatId}>
          <SelectTrigger>       
            <SelectValue placeholder="Select Product Category" />
          </SelectTrigger>
          <SelectContent>
            {productCategories.map((pCat) => (
              <SelectItem key={pCat.$id} value={pCat.$id}>
                {pCat.p_cat_title}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Manufacturer Dropdown */}
        <Select value={manufacturerId} onValueChange={setManufacturerId}>
          <SelectTrigger>
            <SelectValue placeholder="Select Manufacturer" />
          </SelectTrigger>
          <SelectContent>
            {manufacturers.map((man) => (
              <SelectItem key={man.$id} value={man.$id}>
                {man.manufacturer_title}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        </div>
        <div>
          {/* Image Upload */}
          <Label>Images (3 required)</Label>
          <Input type="file" multiple accept="image/*" onChange={handleImageUpload} required />
          <p>Selected Images: {images.length} (Max: 3)</p>
        </div>
        <div>
          {/* Video Upload */}
          <Label>Video (Optional)</Label>
          <Input type="file" accept="video/*" onChange={handleVideoUpload} />
          <p>{video ? `Selected Video: ${video.name}` : "No video selected"}</p>
        </div>
        <Button type="submit">Add Product</Button>
      </form>
        </CardContent>
      </Card>
    </div>
  );
};
