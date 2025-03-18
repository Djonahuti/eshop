import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { getProducts } from '@/lib/appwrite';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

const ProductImageSlider = ({ images }: { images: string[] }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextImage = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
  };

  return (
    <div className="relative w-full h-40">
      <img src={images[currentIndex]} alt="Product Image" className="w-full h-40 object-cover" />
      {images.length > 1 && (
        <button onClick={nextImage} className="absolute top-1/2 right-2 bg-gray-800 text-white p-1 rounded-full">
          ▶
        </button>
      )}
    </div>
  );
};


export const Product = () => {
    const navigate = useNavigate();
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getProducts().then((data) => {
      setProducts(data);
      setLoading(false);
    });
  }, []);

  if (loading) return <p>Loading products...</p>;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-6">
      {products.map((product) => (
  <Card key={product.$id} className="shadow-lg rounded-lg overflow-hidden">
          <ProductImageSlider images={[product.product_img1, product.product_img2, product.product_img3].filter(Boolean)} />
    <CardHeader>
      <CardTitle>{product.product_title}</CardTitle>
    </CardHeader>
    <CardContent>
      <p className="text-gray-600">Price: <s>${product.product_psp_price}</s> ${product.product_price}</p>
      <p className="text-gray-500">
        Category: {Array.isArray(product.cat_id) && product.cat_id.length > 0 ? product.cat_id[0].cat_title : 'N/A'}
      </p>
      <p className="text-gray-500">
        Product Category: {Array.isArray(product.p_cat_id) && product.p_cat_id.length > 0 ? product.p_cat_id[0].p_cat_title : 'N/A'}
      </p>
      <p className="text-gray-500">
        Manufacturer: {Array.isArray(product.manufacturer_id) && product.manufacturer_id.length > 0 ? product.manufacturer_id[0].manufacturer_title : 'N/A'}
      </p>
      <Button className="mt-4 w-full" onClick={() => navigate(`/product/${product.$id}`)}>View Details</Button>
    </CardContent>
  </Card>
))}
    </div>
  );
};
