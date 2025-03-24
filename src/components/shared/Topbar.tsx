import { useEffect, useState } from "react";
import { logout, getProfileImage } from "@/lib/appwriteService";
import { Heart, LogOut, ShoppingCart } from "lucide-react";
import ThemeToggle from "../ThemeToggle";
import { Button } from "../ui/button";
import { Link } from "react-router-dom";


const Topbar = () => {
  //const navigate = useNavigate();
  const [profileImage, setProfileImage] = useState<string | null>(null);

  useEffect(() => {
    const fetchProfileImage = async () => {
      const imageUrl = await getProfileImage();
      setProfileImage(imageUrl);
    };
    fetchProfileImage();
  }, []);
  return (
    <>
    <nav className="fixed top-0 left-0 bg-[#0F1111] w-full h-10 flex justify-between md:hidden items-center text-white text-sm">
        <Link to="/" className="w-24 h-10 mt-2">
          <img
            src="/src/assets/ushop.svg"
            alt="logo"
            width={170}
            height={35}
          />
        </Link>

        <div className="flex items-center border border-transparent p-1">
          <Link to="/cart" className="p-2">
            <ShoppingCart size={24} />
          </Link>
          
          <Link to="/wishlist" className="p-2">
            <Heart size={24} />
          </Link>

          {profileImage && (
          <img
            src={profileImage}
            alt="Profile"
            className="w-9 h-9 rounded-full border border-gray-300"
          />
          )}

          <Button variant="ghost" onClick={logout}>
            <LogOut size={24} />
          </Button>
          <ThemeToggle />
        </div>

    </nav>
    </>
  );
};

export default Topbar;
