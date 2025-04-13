
import { useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  LogOut,
  ChevronLeft,
  ChevronRight,
  MapPin
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";
import { useToast } from "@/hooks/use-toast";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

interface SidebarProps {
  collapsed: boolean;
  setCollapsed: (collapsed: boolean) => void;
}

const Sidebar = ({ collapsed, setCollapsed }: SidebarProps) => {
  const location = useLocation();
  const isMobile = useIsMobile();
  const { toast } = useToast();
  
  const handleLogout = () => {
    toast({
      title: "Logging out",
      description: "You have been logged out successfully."
    });
    // This is where you would connect to Supabase
    // await supabase.auth.signOut();
    setTimeout(() => {
      window.location.href = "/";
    }, 1000);
  };

  const menuItems = [
    {
      path: "/dashboard",
      name: "Dashboard",
      icon: <LayoutDashboard size={20} />,
    },
    {
      path: "/users",
      name: "Users",
      icon: <Users size={20} />,
    },
    {
      path: "/localizacao",
      name: "Localização",
      icon: <MapPin size={20} />,
    },
  ];

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <aside
      className={cn(
        "h-screen bg-sidebar fixed left-0 top-0 z-30 flex flex-col transition-all duration-300 ease-in-out",
        collapsed ? "w-[70px]" : "w-[250px]",
        isMobile && collapsed && "-translate-x-full"
      )}
    >
      {!isMobile && (
        <Button
          variant="ghost"
          size="icon"
          className="absolute -right-4 top-20 z-40 rounded-full border bg-background shadow-md"
          onClick={() => setCollapsed(!collapsed)}
        >
          {collapsed ? (
            <ChevronRight className="h-4 w-4" />
          ) : (
            <ChevronLeft className="h-4 w-4" />
          )}
          <span className="sr-only">Toggle Sidebar</span>
        </Button>
      )}

      <div className="flex h-14 items-center justify-center border-b border-sidebar-border">
        {!collapsed && (
          <h1 className="text-xl font-bold text-sidebar-foreground">
            Admin Portal
          </h1>
        )}
        {collapsed && <div className="text-xl font-bold text-sidebar-foreground">AP</div>}
      </div>

      <div className="flex-1 overflow-y-auto py-4 px-3">
        <nav className="flex flex-col space-y-1">
          {menuItems.map((item) => (
            collapsed ? (
              <Tooltip key={item.path}>
                <TooltipTrigger asChild>
                  <NavLink
                    to={item.path}
                    className={cn(
                      "sidebar-item justify-center",
                      isActive(item.path) && "active"
                    )}
                  >
                    {item.icon}
                    <span className="sr-only">{item.name}</span>
                  </NavLink>
                </TooltipTrigger>
                <TooltipContent side="right" className="bg-sidebar-primary text-sidebar-primary-foreground">
                  {item.name}
                </TooltipContent>
              </Tooltip>
            ) : (
              <NavLink
                key={item.path}
                to={item.path}
                className={cn(
                  "sidebar-item",
                  isActive(item.path) && "active"
                )}
              >
                {item.icon}
                <span>{item.name}</span>
              </NavLink>
            )
          ))}
        </nav>
      </div>

      <div className="border-t border-sidebar-border p-3">
        {collapsed ? (
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                className="w-full flex justify-center text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                onClick={handleLogout}
              >
                <LogOut size={20} />
                <span className="sr-only">Logout</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent side="right" className="bg-sidebar-primary text-sidebar-primary-foreground">
              Logout
            </TooltipContent>
          </Tooltip>
        ) : (
          <Button
            variant="ghost"
            className="w-full flex justify-start text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
            onClick={handleLogout}
          >
            <LogOut size={20} className="mr-3" />
            <span>Logout</span>
          </Button>
        )}
      </div>
    </aside>
  );
};

export default Sidebar;
