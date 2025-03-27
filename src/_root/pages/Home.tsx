import { Button } from "@/components/ui/button";
import { FilterIcon } from "lucide-react";
import { displayManufacturers, displayProductCategories } from "@/lib/appwrite";
import { useEffect, useState } from "react";
import { ProductCard } from "@/components/shared/ProductCard";

const Home = () => {
  const [pCategory, setPCategory] = useState<any[]>([]);
  const [manufacturer, setManufacturer] = useState<any[]>([]);
  const [selectedManufacturer, setSelectedManufacturer] = useState<string | null>(null);
  const [selectedProductCategory, setSelectedProductCategory] = useState<string | null>(null);

  const handleManufacturerClick = (manufacturerId: string) => {
    setSelectedManufacturer(manufacturerId);
    setSelectedProductCategory(null); // Reset category when manufacturer is selected
  };
  
  const handleProductCategoryClick = (pCatId: string) => {
    setSelectedProductCategory(pCatId);
    setSelectedManufacturer(null); // Reset manufacturer when Product category is selected
  };
  
  const resetFilters = () => {
    setSelectedManufacturer(null);
    setSelectedProductCategory(null);
  };

  //To fetch and display Manufacturers
  useEffect(() => {
    displayManufacturers().then((data) => {
      setManufacturer(data);
    })
  })

  //To fetch and display Product Categories
  useEffect(() => {
    displayProductCategories().then((data) => {
      setPCategory(data);
    })
  })

  return(
    <>

    {/* Banner Section */}
    <div className="space-y-1">

      <div className="flex items-center gap-4">
      </div>

    <div className="bg-[#222F3D] h-10 flex items-center text-white text-sm pl-4">
        <div className="flex items-center gap-1 border border-transparent p-2 hover:border-white">
        <Button
          variant="ghost"
          onClick={resetFilters}
        >
          <FilterIcon size={24} />
        </Button>
            <p className="font-bold">All</p>
        </div>

        <ul className="flex items-center">
            <li className="border border-transparent p-2 hover:border-white">Today's Deals</li>
            <li className="border border-transparent p-2 hover:border-white">Customer Service</li>
            <li className="border border-transparent p-2 hover:border-white">Registry</li>
            <li className="border border-transparent p-2 hover:border-white">Gift Cards</li>
            <li className="border border-transparent p-2 hover:border-white">Sell</li>
        </ul>
    </div>
    <section className="bg-pink-500 text-white text-center py-10">
      <h2 className="text-4xl font-bold">UP TO 80% OFF</h2>
      <p className="mt-2">Sale Ends: Mar 27, 07:59 (GMT+1)</p>
    </section>

    {/* Manufacturers Section */}
    <section className="p-4">
      <h3 className="text-accent-foreground font-bold mb-4">Brands</h3>
      <div className="grid grid-cols-5 md:grid-cols-9 gap-4">
        {manufacturer.map((man) => (
        <div key={man.$id} className={`bg-white rounded-lg p-4 shadow-md justify-items-center cursor-pointer ${
          selectedManufacturer === man.$id ? "border border-blue-500" : ""
        }`}
        onClick={() => handleManufacturerClick(man.$id)}
      >
          <img src={man.manufacturer_image} alt="deals" className="rounded-lg h-12 w-12" />
        </div>
    
        ))}
      </div>
    </section>

    {/* Categories Section */}
    <section className="p-4">
      <h3 className="text-accent-foreground font-bold mb-4">Categories</h3>
      <div className="grid grid-cols-5 md:grid-cols-9 gap-4">
        {pCategory.map((pCat) => (
        <div key={pCat.$id} className={`bg-white rounded-lg p-4 shadow-md justify-items-center cursor-pointer ${
          selectedProductCategory === pCat.$id ? "border border-green-500" : ""
        }`}
        onClick={() => handleProductCategoryClick(pCat.$id)}
      >
          <img src={pCat.p_cat_image} alt="deals" className="rounded-lg h-12 w-12" />
        </div>

        ))}
      </div>
    </section>

    <section className="p-5">
      <div><ProductCard manufacturerId={selectedManufacturer} pCatId={selectedProductCategory} /></div>
      </section>
    
    </div>
    </>
  );
};

export default Home;
