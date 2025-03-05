import { Routes, Route } from "react-router-dom";
import Home from "./_root/pages/Home";
import Products from "./_root/pages/Products";
import Navbar from "./components/shared/Navbar";
import Topbar from "./components/shared/Topbar";
import Bottombar from "./components/shared/Bottombar";

function App() {
  return (
    <>
    <div className="hidden md:block"><Navbar /></div>
    <div className="md:hidden"><Topbar /></div>
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/products" element={<Products />} />
    </Routes>

    <Bottombar />
    </>
  );
}

export default App;
