import { Outlet } from "react-router-dom";


import Navbar from "@/components/shared/Navbar";
import Topbar from "@/components/shared/Topbar";
import Bottombar from "@/components/shared/Bottombar";

const RootLayout = () => {
  return (
    <div className="w-full md:flex">
      <Topbar />
      <Navbar />

      <section className="flex flex-1 h-full">
        <Outlet />
      </section>

      <Bottombar />
    </div>
  );
};

export default RootLayout;
