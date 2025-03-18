import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getProducts } from '@/lib/appwrite';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import ProductImageSlider from '@/components/shared/ProductImageSlider';

interface Product {
  $id: string;
  product_title: string;
  product_label?: string;
  product_price: number;
  product_psp_price?: number;
  product_features: string[];
  product_desc: string;
  product_video?: string;
  product_img1?: string;
  product_img2?: string;
  product_img3?: string;
  cat_id?: { $id: string; cat_title: string }[];
  p_cat_id?: { $id: string; p_cat_title: string }[];
  manufacturer_id?: { $id: string; manufacturer_title: string }[];
};

const ProductDetails = () => {
  const { id } = useParams<{ id: string }>();

  const [product, setProduct] = useState<Product | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);

  useEffect(() => {
    getProducts().then((data: Product[]) => {

      const foundProduct = data.find((p) => p.$id === id);
      if (!foundProduct) return;

      setProduct(foundProduct);

      // Find related products based on cat_id, p_cat_id, manufacturer_id
      const related = data.filter(
        (p) =>
          (foundProduct.cat_id && p.cat_id?.some((c) => foundProduct.cat_id?.some((fc) => fc.$id === c.$id))) ||
          (foundProduct.p_cat_id && p.p_cat_id?.some((pc) => foundProduct.p_cat_id?.some((fpc) => fpc.$id === pc.$id))) ||
          (foundProduct.manufacturer_id &&
            p.manufacturer_id?.some((m) => foundProduct.manufacturer_id?.some((fm) => fm.$id === m.$id)))
      );

      setRelatedProducts(related);
    });
  }, [id]);

  if (!product) return <p className="text-center text-lg">Loading product details...</p>;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Product Image */}
        <div>
            <ProductImageSlider images={[product.product_img1, product.product_img2, product.product_img3].filter(Boolean)} />

            {/* Product Features */}
        {product.product_features.length > 0 && (
          <div className="mt-6">
            <h2 className="text-lg font-bold text-gray-800">Features:</h2>
            <ul className="list-disc list-inside text-gray-600 mt-2 space-y-2">
              {product.product_features.map((feature, index) => (
                <li key={index}>{feature}</li>
              ))}
            </ul>
          </div>
        )}
      </div>

        {/* Product Details */}
        <div className="space-y-4">
        <h1 className="text-3xl font-bold">{product.product_title}</h1>
        
        {/* Price */}
          <h2 className="text-2xl font-bold text-gray-500">
            <s className="text-red-600">{product.product_psp_price && `₦${product.product_psp_price}`}</s> ₦{product.product_price}
          </h2>

          <p className="text-lg text-gray-500">Category: <span className="ushop-primary font-bold">{product.cat_id?.[0]?.cat_title}</span></p>
          {product.product_label && <Badge className="bg-green-700 text-white">{product.product_label}</Badge>}

          <p className="text-gray-600 mt-2">{product.product_desc}</p>

          {/* Product Video */}
          {product.product_video && (
          <div>
            <h2 className="text-md font-bold text-gray-700">Product Video</h2>
            <iframe
              className="w-full h-56 rounded-lg shadow-md"
              src={product.product_video}
              title="Product Video"
              allowFullScreen
            ></iframe>
          </div>
          )}

          {/* Quantity & Size Selection */}
        <div className="flex space-x-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Quantity:</label>
            <Input type="number" defaultValue={1} className="w-20" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Bundle Quantity (Optional):</label>
            <Input type="number" defaultValue={0} className="w-20" />
          </div>
        </div>

        <div className="flex space-x-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Size:</label>
            <Input type="text" defaultValue="Small" className="w-24" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Bundle Size (Optional):</label>
            <Input type="text" defaultValue="Small" className="w-24" />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex space-x-4">
          <Button className="bg-red-500 hover:bg-red-600">Add to Cart</Button>
          <Button className="bg-gray-700 hover:bg-gray-800">Add to Wishlist</Button>
        </div>
        </div>
      </div>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <div className="mt-12">
          <h2 className="text-xl font-bold text-gray-700 mb-4">Related Products</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {relatedProducts.map((rel) => (
              <Card key={rel.$id} className="bg-gray-800 p-4 rounded-lg shadow-md">
                <CardHeader>
                  <CardTitle className="text-orange-400">{rel.product_title}</CardTitle>
                  <p className="text-xs text-gray-400">
                    {rel.manufacturer_id?.[0]?.manufacturer_title}
                  </p>
                </CardHeader>
                <CardContent>
                  <img
                    src={rel.product_img1 || "/placeholder.jpg"}
                    alt={rel.product_title}
                    className="w-full h-32 object-contain rounded-md mb-2"
                  />
                  <p className="text-gray-300">
                    <s className="text-gray-500">{rel.product_psp_price && `₦${rel.product_psp_price}`}</s>{" "}
                    ₦{rel.product_price}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductDetails;
