import ThemeToggle from "../ThemeToggle";


const Navbar = () => {
  return (
    <nav className="p-4 bg-gray-800 text-white flex justify-between">
      <span>Ushop</span>
      <ThemeToggle />
    </nav>
  );
};

export default Navbar;
