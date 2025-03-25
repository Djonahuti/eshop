import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { addProduct, getCategories, getManufacturers, getProductCategories } from "@/lib/appwrite"; // Ensure this is correctly imported
import FileUploader from "../FileUploader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PackagePlus } from "lucide-react";

export function PostForm() {
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [pspPrice, setPspPrice] = useState("");
  const [description, setDescription] = useState("");
  const [features, setFeatures] = useState("");
  const [keywords, setKeywords] = useState("");
  const [label, setLabel] = useState("");
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
      // Fetch categories, product categories, and manufacturers on load
      Promise.all([getCategories(), getProductCategories(), getManufacturers()])
        .then(([categories, productCategories, manufacturers]) => {
          setCategories(categories);
          setProductCategories(productCategories);
          setManufacturers(manufacturers);
        })
        .catch((err) => console.error("Error fetching data:", err));
    }, []);

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

    console.log("Final Form Data Before Submission:", {
      name,
      price,
      pspPrice,
      categoryId,
      pCatId,
      manufacturerId,
    });
  
    if (!name || !price || !pspPrice || !description || !features || !keywords || !label || !productUrl || !categoryId || !pCatId || !manufacturerId || images.length < 1) {
      console.error("One or more relationship fields are empty!");
      setError("All fields are required, including at least one image.");
      return;
    }
  
    const productData = {
      name,
      price: parseFloat(price),
      pspPrice: parseFloat(pspPrice),
      description,
  
      // ✅ Convert features from a string to an array
      features: features.split(",").map((feature) => feature.trim()),
  
      keywords,
      label,
      status: "active",
      productUrl,
      images: images.map((img) => img.file),
      video: video ? video.file : undefined,
  
      // ✅ Ensure they are being passed as string or it's defined
      cat_id: categoryId ?? null,
      p_cat_id: pCatId ?? null,
      manufacturer_id: manufacturerId ?? null,
    };
  
    console.log("Submitting Product Data:", productData); // Debugging Log
  
    try {
      await addProduct(productData);
      console.log("Product Submitted Successfully!");
  
      // Reset form
      setName("");
      setPrice("");
      setPspPrice("");
      setDescription("");
      setFeatures("");
      setKeywords("");
      setLabel("");
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
            <CardHeader className="flex items-center gap-2 self-center font-medium">
                <CardTitle className="flex items-center justify-center"><PackagePlus/>Add Product</CardTitle>
            </CardHeader>
            <CardContent>
    <form onSubmit={handleSubmit} className="space-y-4 p-6 shadow rounded-lg">
      {error && <p className="text-red-500">{error}</p>}
        <div className="space-y-2">
          <Label>Product Name</Label>
          <Input value={name} onChange={(e) => setName(e.target.value)} required />
        </div>
        <div className="space-y-2">
          <Label>Price</Label>
          <Input type="number" value={price} onChange={(e) => setPrice(e.target.value)} required />
        </div>
        <div className="space-y-2">
          <Label>Slashed Price</Label>
          <Input type="number" value={pspPrice} onChange={(e) => setPspPrice(e.target.value)} required />
        </div>
        <div className="space-y-2">
          <Label>Description</Label>
          <Textarea value={description} onChange={(e) => setDescription(e.target.value)} required />
        </div>
        <div className="space-y-2">
          <Label>Features</Label>
          <Textarea value={features} onChange={(e) => setFeatures(e.target.value)} required />
        </div>
        <div className="space-y-2">
          <Label>Keywords</Label>
          <Input value={keywords} onChange={(e) => setKeywords(e.target.value)} required />
        </div>
        <div className="space-y-2">
          <Label>Label</Label>
          <Input value={label} onChange={(e) => setLabel(e.target.value)} required />
        </div>
        <div className="space-y-2">
          <Label>Product URL</Label>
          <Input value={productUrl} onChange={(e) => setProductUrl(e.target.value)} required />
        </div>
        <div className="grid md:grid-cols-3 sm:grid-cols-2 lg:grid-cols-3 justify-items-center">

        {/* Category Dropdown */}
        <Select value={categoryId} onValueChange={(value) => {
          console.log("Selected Category ID:", value);
          setCategoryId(value);
        }}>
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
        <Select value={pCatId} onValueChange={(value) => {
          console.log("Selected Product Category ID:", value);
          setPCatId(value);
        }}>
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
        <Select value={manufacturerId} onValueChange={(value) => {
          console.log("Selected Manufacturer ID:", value);
          setManufacturerId(value);
        }}>
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

      <FileUploader accept="image/*" multiple onUpload={setImages} />
      <FileUploader accept="video/*" onUpload={(files) => setVideo(files[0] || null)} />

      <Button type="submit">Add Product</Button>
    </form>
            </CardContent>
        </Card>
    </div>
  );
};

