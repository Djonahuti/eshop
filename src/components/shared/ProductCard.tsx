import { Card, CardContent } from "@/components/ui/card";
import { getProducts, getProductsByManufacturer, getProductsByProductCategory } from "@/lib/appwrite";
import { ShoppingCart, Heart } from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";


export const ProductCard = ({
  manufacturerId,
  pCatId,
}: {
  manufacturerId: string | null;
  pCatId: string | null;
}) => {
const [products, setProducts] = useState<any[]>([]);
const [loading, setLoading] = useState(true);

useEffect(() => {
  setLoading(true);
  const fetchProducts = async () => {
    let data = [];
    if (manufacturerId) {
      data = await getProductsByManufacturer(manufacturerId);
    } else if (pCatId) {
      data = await getProductsByProductCategory(pCatId);
    } else {
      data = await getProducts();
    }
    setProducts(data);
    setLoading(false);
  };
  fetchProducts();
}, [manufacturerId, pCatId]); // Track changes in both filters

if (loading) return <p>Loading products...</p>;
  return (
    <>
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
    {products.map((product) => (
    <Card key={product.$id} className="w-full max-w-xs shadow-lg rounded-xl p-4">
      <div className="relative">
      <ImageSlider images={[product.product_img1, product.product_img2, product.product_img3].filter(Boolean)} />
        <div></div><span className="absolute top-2 right-2 bg-black text-white text-xs px-2 py-1 rounded">
        {product.manufacturer_id ? product.manufacturer_id.manufacturer_title : 'N/A'}
        </span>
      </div>
      <CardContent className="mt-4 text-center">
            <Link to={`/product/${product.$id}`} className="text-lg font-semibold ushop-primary hover:underline">
              {product.product_title}
            </Link>
            <div className="relative flex justify-between items-center mt-2">
              <p className="bg-green-700 text-white text-xs px-2 py-1 rounded">{product.product_label}</p>
              <p className="text-lg font-bold">₦{product.product_price}</p>
            </div>
        <div className="flex justify-center gap-4 mt-3">
          <button className="p-2 rounded-full bg-gray-200 hover:bg-gray-300 transition">
            {/* Add to Wishlist icon */}
            <Heart className="h-5 w-5 text-gray-600" />
          </button>
          <button className="p-2 rounded-full bg-gray-200 hover:bg-gray-300 transition">
          {/* Add to Cart icon */}
            <ShoppingCart className="h-5 w-5 text-gray-600" />
          </button>
        </div>
      </CardContent>
    </Card>
))}
      </div>
    </div>
    </>
  );
};

const ImageSlider = ({ images }: { images: string[] }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 3000); // Change image every 3 seconds

    return () => clearInterval(interval);
  }, [images]);

  return (
    <div className="w-full h-60 overflow-hidden rounded-md">
      <img
        src={images[currentIndex]}
        alt="Product"
        className="w-full h-full object-contain transition-opacity duration-500"
      />
    </div>
  );
};
