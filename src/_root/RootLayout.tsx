import { Outlet } from "react-router-dom";


import Navbar from "@/components/shared/Navbar";
import Topbar from "@/components/shared/Topbar";
import Bottombar from "@/components/shared/Bottombar";

const RootLayout = () => {
  return (
    <>
    <Topbar />
    <div className="min-h-screen bg-gray-100">
      <div className="hidden md:block"><Navbar /></div>

      <section>
        <Outlet />
      </section>

      <Bottombar />
    </div>
    </>
  );
};

export default RootLayout;
