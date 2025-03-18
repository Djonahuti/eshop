import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";
import Products from "./Products";

const Home = () => {
  return(
    <>

    {/* Banner Section */}
    <div className="space-y-1">

      <div className="flex items-center gap-4">
      </div>

    <div className="bg-[#222F3D] h-10 flex items-center text-white text-sm pl-4">
        <div className="flex items-center gap-1 border border-transparent p-2 hover:border-white">
        <Button variant="ghost">
          <Menu size={24} />
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

    {/* Deals Section */}
    <section className="p-4">
      <h3 className="text-2xl font-bold mb-4">Today's Deals</h3>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg shadow-md">
          <img src="/img1.jpg" alt="Deal 1" className="w-full rounded-lg" />
          <p className="mt-2 text-lg font-bold">NGN103,192</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-md">
          <img src="/img2.jpg" alt="Deal 2" className="w-full rounded-lg" />
          <p className="mt-2 text-lg font-bold">NGN3,911.10</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-md">
          <img src="/img3.jpg" alt="Deal 3" className="w-full rounded-lg" />
          <p className="mt-2 text-lg font-bold">NGN5,084.19</p>
        </div>
      </div>
    </section>

    <section className="p-5"><Products /></section>
    
    </div>
    </>
  );
};

export default Home;
