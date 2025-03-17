import { useEffect, useState } from "react";
import { logout, getProfileImage } from "@/lib/appwriteService";
import ThemeToggle from "../ThemeToggle";

const Navbar = () => {
  const [profileImage, setProfileImage] = useState<string | null>(null);

  useEffect(() => {
    const fetchProfileImage = async () => {
      const imageUrl = await getProfileImage();
      setProfileImage(imageUrl);
    };
    fetchProfileImage();
  }, []);

  return (
    <nav className="p-4 bg-gray-800 text-white flex justify-between items-center">
      <span className="text-xl font-bold">Ushop</span>
      <div className="flex items-center gap-4">
        {profileImage && (
          <img
            src={profileImage}
            alt="Profile"
            className="w-10 h-10 rounded-full border border-gray-300"
          />
        )}
        <ThemeToggle />
        <button
          onClick={logout}
          className="bg-red-500 px-4 py-2 rounded text-white hover:bg-red-600"
        >
          Logout
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
