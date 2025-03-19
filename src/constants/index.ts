
import { Home, Package2, PackagePlus, PackageSearch, Settings, UsersRound } from "lucide-react";

export const sidebarLinks = [
  {
    imgURL: Home,
    route: "/admin-dashboard",
    label: "Home",
  },
  {
    imgURL: UsersRound,
    route: "/users",
    label: "Users",
  },
  {
    imgURL: PackagePlus,
    route: "/add-product",
    label: "Add Product",
  },
  {
    imgURL: PackageSearch,
    route: "/view-products",
    label: "Products",
  },
  {
    imgURL: Package2,
    route: "/orders",
    label: "Orders",
  },
  {
    imgURL: Settings,
    route: "/admin-dashboard",
    label: "Settings",
  },
];

export const bottombarLinks = [
  {
    imgURL: "/assets/icons/home.svg",
    route: "/",
    label: "Home",
  },
  {
    imgURL: "/assets/icons/wallpaper.svg",
    route: "/market",
    label: "Market",
  },
  {
    imgURL: "/assets/icons/bookmark.svg",
    route: "/cart",
    label: "Cart",
  },
  {
    imgURL: "/assets/icons/gallery-add.svg",
    route: "/wishlist",
    label: "Wishlist",
  },
];
