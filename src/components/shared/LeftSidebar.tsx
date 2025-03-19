

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { sidebarLinks } from "@/constants"
import ThemeToggle from "../ThemeToggle"
import { LogOut } from "lucide-react"
import { logout } from "@/lib/appwriteService"

// Menu items.


export function AppSidebar() {
  return (
    <Sidebar>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>
            <img
              src="/src/assets/ushop.svg"
              alt="logo"
              width={85}
              height={20}
            />
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
            {sidebarLinks.map((link) => (
                <SidebarMenuItem key={link.label}>
                  <SidebarMenuButton asChild>
                    <a href={link.route}>
                      <link.imgURL />
                      <span>{link.label}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
              
                {/* Logout Button as a Sidebar Item */}
                <SidebarMenuItem>
                  <SidebarMenuButton asChild>
                    <button onClick={logout} className="flex space-x-0 w-full text-left cursor-pointer">
                      <LogOut/>
                      <span>Logout</span>
                    </button>
                  </SidebarMenuButton>
                </SidebarMenuItem>

                {/* Theme Toggle as a Sidebar Item */}
                <SidebarMenuItem>
                  <SidebarMenuButton asChild>
                    <div className="space-x-0 items-center flex cursor-pointer">
                      <ThemeToggle />
                    </div>
                  </SidebarMenuButton>
                </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  )
}
