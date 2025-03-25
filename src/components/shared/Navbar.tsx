import { useEffect, useState } from "react";
import { logout, getProfileImage } from "@/lib/appwriteService";
import ThemeToggle from "../ThemeToggle";
import { Button } from "../ui/button";
import { Globe, LogOut, Search, ShoppingCart } from "lucide-react";
import { Link } from "react-router-dom";

const Navbar = () => {
  const [search, setSearch] = useState("");
  const [profileImage, setProfileImage] = useState<string | null>(null);

  useEffect(() => {
    const fetchProfileImage = async () => {
      const imageUrl = await getProfileImage();
      setProfileImage(imageUrl);
    };
    fetchProfileImage();
  }, []);

  return (
    <nav className="nav-bg shadow-md px-4 py-3 flex items-center justify-between">
    <Link to="/" className="w-24 h-10 mt-2">
      <img
        src="/src/assets/ushop.svg"
        alt="logo"
        width={170}
        height={40}
      />
    </Link>

      <div className="relative flex-grow max-w-xl">
        <input
          type="text"
          className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none"
          placeholder="Search products..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <Button className="absolute right-2 top-1/2 -translate-y-1/2" variant="ghost">
          <Search size={20} />
        </Button>
      </div>

      <div className="flex items-center space-x-4">
        <Button variant="ghost">      
          <Globe size={24} />
        </Button>
        <Button variant="ghost">      
          {profileImage && (
          <img
            src={profileImage}
            alt="Profile"
            className="w-10 h-10 rounded-full border border-gray-300"
          />
        )}
        </Button>
        <Button variant="ghost">
          <ShoppingCart size={24} />
        </Button>
        <Button variant="ghost" onClick={logout}>
          <LogOut size={24} />
        </Button>
        <ThemeToggle />
      </div>
    </nav>
  );
};

export default Navbar;
