import ThemeToggle from "../ThemeToggle";


const Topbar = () => {
  return (
    <div className="fixed top-0 left-0 w-full p-4 bg-gray-900 text-white flex justify-between md:hidden">
      <span>Ushop</span>
      <ThemeToggle />
    </div>
  );
};

export default Topbar;
