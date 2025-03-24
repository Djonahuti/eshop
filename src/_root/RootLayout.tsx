import { Outlet } from "react-router-dom";


import Navbar from "@/components/shared/Navbar";
import Topbar from "@/components/shared/Topbar";
import Bottombar from "@/components/shared/Bottombar";

const RootLayout = () => {
  return (
    <>
    
    <div className="min-h-screen">
      <div className="md:hidden"><Topbar /></div>
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
