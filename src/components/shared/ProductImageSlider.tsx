import { useState } from "react";

const ProductImageSlider = ({ images }: { images: string[] }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextImage = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
  };

  const prevImage = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + images.length) % images.length);
  };

  return (
    <div className="relative w-full max-w-md">
      <img src={images[currentIndex]} alt="Product Image" className="w-full h-100 object-contain rounded-lg shadow-md" />
      {images.length > 1 && (
        <>
          <button onClick={prevImage} className="absolute left-2 top-1/2 -translate-y-1/2 bg-gray-800 text-white p-1 rounded-full">
            ◀
          </button>
          <button onClick={nextImage} className="absolute right-2 top-1/2 -translate-y-1/2 bg-gray-800 text-white p-1 rounded-full">
            ▶
          </button>
        </>
      )}
    </div>
  );
};

export default ProductImageSlider;
