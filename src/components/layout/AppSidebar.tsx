import { 
  LayoutDashboard, 
  Monitor, 
  FileText, 
  AlertTriangle, 
  Settings,
  Users,
  Activity
} from "lucide-react";
import { NavLink } from "react-router-dom";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { BRANDING } from "@/config/branding";

const menuItems = [
  { title: "Панель управления", url: "/", icon: LayoutDashboard },
  { title: "Сотрудники", url: "/employees", icon: Users },
  { title: "Активность", url: "/activity", icon: Activity },
  { title: "Отчеты", url: "/reports", icon: FileText },
  { title: "Агенты", url: "/agents", icon: Monitor },
  { title: "Алерты", url: "/alerts", icon: AlertTriangle },
  { title: "Настройки", url: "/settings", icon: Settings },
];

export function AppSidebar() {
  const { state } = useSidebar();
  const isCollapsed = state === "collapsed";

  return (
    <Sidebar collapsible="icon" className="border-r">
      <SidebarContent>
        <div className="p-4 border-b">
          <h2 className={`font-bold ${isCollapsed ? 'text-center text-sm' : 'text-lg'}`}>
            {isCollapsed ? 'GA' : BRANDING.orgName}
          </h2>
        </div>
        
        <SidebarGroup>
          <SidebarGroupLabel>Навигация</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink
                      to={item.url}
                      end={item.url === "/"}
                      className={({ isActive }) =>
                        isActive ? "bg-sidebar-accent text-sidebar-accent-foreground" : ""
                      }
                    >
                      <item.icon className="h-4 w-4" />
                      {!isCollapsed && <span>{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
