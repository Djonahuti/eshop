import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import FileUploader from "../FileUploader";
import { addProduct, getCategories, getProductCategories, getManufacturers, storage } from "@/lib/appwrite";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

const formSchema = z.object({
  name: z.string().min(2, { message: "Product name is required." }),
  price: z.string().min(1, { message: "Price is required." }),
  pspPrice: z.string().min(1, { message: "Slashed price is required." }),
  description: z.string().min(5, { message: "Description is too short." }),
  features: z.string().min(5, { message: "Features are required." }),
  keywords: z.string().min(1, { message: "Keywords are required." }),
  label: z.string().min(1, { message: "Label is required." }),
  productUrl: z.string().min(1, { message: "Product URL is required." }),
  categoryId: z.string().min(1, { message: "Category is required." }),
  pCatId: z.string().min(1, { message: "Product category is required." }),
  manufacturerId: z.string().min(1, { message: "Manufacturer is required." }),
  product_img1: z.string().url({ message: "Image 1 is required." }),
  product_img2: z.string().url({ message: "Image 2 is required." }),
  product_img3: z.string().url({ message: "Image 3 is required." }),
  product_video: z.string().optional(),
});

export function PostForm() {
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      price: "",
      pspPrice: "",
      description: "",
      features: "",
      keywords: "",
      label: "",
      productUrl: "",
      categoryId: "",
      pCatId: "",
      manufacturerId: "",
      product_img1: "",
      product_img2: "",
      product_img3: "",
      product_video: "",
    },
  });

  const [categories, setCategories] = useState([]);
  const [productCategories, setProductCategories] = useState([]);
  const [manufacturers, setManufacturers] = useState([]);

  useEffect(() => {
    Promise.all([getCategories(), getProductCategories(), getManufacturers()])
      .then(([categories, productCategories, manufacturers]) => {
        setCategories(categories || []);
        setProductCategories(productCategories || []);
        setManufacturers(manufacturers || []);
      })
      .catch((err) => console.error("Error fetching data:", err));
  }, []);

  async function onSubmit(values) {
    try {
      // Ensure images are stored as URLs
      const uploadedImages = [values.product_img1, values.product_img2, values.product_img3]
        .filter(img => typeof img === "string"); // ✅ Ensure only strings are used
  
      const uploadedVideo = typeof values.product_video === "string" ? values.product_video : "";
  
      const formattedValues = {
        ...values,
        images: uploadedImages, // ✅ Ensure images are an array of URLs
        video: uploadedVideo, // ✅ Ensure video is a URL
      };
  
      delete formattedValues.product_img1;
      delete formattedValues.product_img2;
      delete formattedValues.product_img3;
      delete formattedValues.product_video;
  
      console.log("Submitting product:", formattedValues); // ✅ Debugging before API call
  
      await addProduct(formattedValues);
      form.reset();
    } catch (err) {
      console.error("Error adding product:", err);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField control={form.control} name="name" render={({ field }) => (
          <FormItem>
            <FormLabel>Product Name</FormLabel>
            <FormControl><Input {...field} /></FormControl>
            <FormMessage />
          </FormItem>
        )} />

        <FormField control={form.control} name="price" render={({ field }) => (
          <FormItem>
            <FormLabel>Price</FormLabel>
            <FormControl><Input type="number" {...field} /></FormControl>
            <FormMessage />
          </FormItem>
        )} />

        <FormField control={form.control} name="pspPrice" render={({ field }) => (
          <FormItem>
            <FormLabel>Old Price</FormLabel>
            <FormControl><Input type="number" {...field} /></FormControl>
            <FormMessage />
          </FormItem>
        )} />

        <FormField control={form.control} name="description" render={({ field }) => (
          <FormItem>
            <FormLabel>Description</FormLabel>
            <FormControl><Input {...field} /></FormControl>
            <FormMessage />
          </FormItem>
        )} />

        <FormField control={form.control} name="features" render={({ field }) => (
          <FormItem>
            <FormLabel>Features</FormLabel>
            <FormControl><Textarea {...field} /></FormControl>
            <FormMessage />
          </FormItem>
        )} />

        <FormField control={form.control} name="keywords" render={({ field }) => (
          <FormItem>
            <FormLabel>Keywords</FormLabel>
            <FormControl><Input {...field} /></FormControl>
            <FormMessage />
          </FormItem>
        )} />

        <FormField control={form.control} name="label" render={({ field }) => (
          <FormItem>
            <FormLabel>Label</FormLabel>
            <FormControl><Input {...field} /></FormControl>
            <FormMessage />
          </FormItem>
        )} />

        <FormField control={form.control} name="productUrl" render={({ field }) => (
          <FormItem>
            <FormLabel>Product Url</FormLabel>
            <FormControl><Input {...field} /></FormControl>
            <FormMessage />
          </FormItem>
        )} />

        {/* Category Select */}
        <FormField control={form.control} name="categoryId" render={({ field }) => (
          <FormItem>
            <FormLabel>Category</FormLabel>
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <SelectTrigger><SelectValue placeholder="Select Category" /></SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category.$id} value={category.$id}>{category.cat_title}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )} />

        {/* Product Category Select */}
        <FormField control={form.control} name="pCatId" render={({ field }) => (
          <FormItem>
            <FormLabel>Product Category</FormLabel>
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <SelectTrigger><SelectValue placeholder="Select Product Category" /></SelectTrigger>
              <SelectContent>
                {productCategories.map((pCat) => (
                  <SelectItem key={pCat.$id} value={pCat.$id}>{pCat.p_cat_title}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )} />

        {/* Manufacturer Select */}
        <FormField control={form.control} name="manufacturerId" render={({ field }) => (
          <FormItem>
            <FormLabel>Manufacturer</FormLabel>
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <SelectTrigger><SelectValue placeholder="Select Manufacturer" /></SelectTrigger>
              <SelectContent>
                {manufacturers.map((man) => (
                  <SelectItem key={man.$id} value={man.$id}>{man.manufacturer_title}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )} />

        {/* Image Uploads */}
        {["product_img1", "product_img2", "product_img3"].map((img, index) => (
          <FormField key={img} control={form.control} name={img} render={({ field }) => (
            <FormItem>
              <FormLabel>Product Image {index + 1}</FormLabel>
              <FormControl>
                <FileUploader fieldChange={field.onChange} mediaUrl={field.value} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )} />
        ))}

        <FormField control={form.control} name="product_video" render={({ field }) => (
          <FormItem>
            <FormLabel>Product Video (Optional)</FormLabel>
            <FormControl>
              <FileUploader fieldChange={field.onChange} mediaUrl={field.value} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )} />

        <Button type="submit">Add Product</Button>
      </form>
    </Form>
  );
}
