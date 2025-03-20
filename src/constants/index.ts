
import { CameraIcon, ClipboardListIcon, DatabaseIcon, FileCodeIcon, FileIcon, FileTextIcon, HelpCircleIcon, LayoutDashboardIcon, Package2, PackagePlus, PackageSearch, SearchIcon, SettingsIcon, User2, UsersRound } from "lucide-react";

const navData = {
  user: {
    name: "Admin",
    email: "m@example.com",
    avatar: User2,
  },

  sidebarLinks: [
    {
      imgURL: LayoutDashboardIcon,
      route: "/dashboard",
      label: "Dashboard",
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
      route: "/dashboard",
      label: "Products",
    },
    {
      imgURL: Package2,
      route: "/orders",
      label: "Orders",
    },
  ],

  navClouds: [
    {
      imgURL: CameraIcon,
      route: "#",
      isActive: true,
      label: "Capture",
      items: [
        {
          label: "Active Proposals",
          route: "#",
        },
        {
          label: "Archived",
          route: "#",
        },
      ],
    },
    {
      imgURL: FileTextIcon,
      route: "#",
      label: "Proposal",
      items: [
        {
          label: "Active Proposals",
          route: "#",
        },
        {
          label: "Archived",
          route: "#",
        },
      ],
    },
    {
      imgURL: FileCodeIcon,
      route: "#",
      label: "Prompts",
      items: [
        {
          label: "Active Proposals",
          route: "#",
        },
        {
          label: "Archived",
          route: "#",
        },
      ],
    },
  ],

  navSecondary: [
    {
      imgURL: SettingsIcon,
      route: "#",
      label: "Settings",
    },
    {
      imgURL: HelpCircleIcon,
      route: "#",
      label: "Get Help",
    },
    {
      imgURL: SearchIcon,
      route: "#",
      label: "Search",
    },
  ],

  navDocuments: [
    {
      imgURL: DatabaseIcon,
      route: "#",
      label: "Data Library",
    },
    {
      imgURL: ClipboardListIcon,
      route: "#",
      label: "Reports",
    },
    {
      imgURL: FileIcon,
      route: "#",
      label: "Word Assistant",
    },
  ],
};

export default {
  navData
}
export const sidebarLinks = [
  {
    imgURL: LayoutDashboardIcon,
    route: "/dashboard",
    label: "Dashboard",
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
    route: "/dashboard",
    label: "Products",
  },
  {
    imgURL: Package2,
    route: "/orders",
    label: "Orders",
  },
];

export const navClouds = [
  {
    imgURL: CameraIcon,
    route: "#",
    isActive: true,
    label: "Capture",
    items: [
      {
        label: "Active Proposals",
        route: "#",
      },
      {
        label: "Archived",
        route: "#",
      },
    ],
  },
  {
    imgURL: FileTextIcon,
    route: "#",
    label: "Proposal",
    items: [
      {
        label: "Active Proposals",
        route: "#",
      },
      {
        label: "Archived",
        route: "#",
      },
    ],
  },
  {
    imgURL: FileCodeIcon,
    route: "#",
    label: "Prompts",
    items: [
      {
        label: "Active Proposals",
        route: "#",
      },
      {
        label: "Archived",
        route: "#",
      },
    ],
  },
];

export const navSecondary = [
  {
    imgURL: SettingsIcon,
    route: "#",
    label: "Settings",
  },
  {
    imgURL: HelpCircleIcon,
    route: "#",
    label: "Get Help",
  },
  {
    imgURL: SearchIcon,
    route: "#",
    label: "Search",
  },
];

export const navDocuments = [
  {
    imgURL: DatabaseIcon,
    route: "#",
    label: "Data Library",
  },
  {
    imgURL: ClipboardListIcon,
    route: "#",
    label: "Reports",
  },
  {
    imgURL: FileIcon,
    route: "#",
    label: "Word Assistant",
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
