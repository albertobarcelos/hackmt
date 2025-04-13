
import React, { useState, useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import Sidebar from "@/components/dashboard/Sidebar";
import Header from "@/components/dashboard/Header";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";

const DashboardLayout = () => {
  const [collapsed, setCollapsed] = useState(false);
  const isMobile = useIsMobile();
  const location = useLocation();
  
  // Check if we're in a mobile app route
  const isMobileAppRoute = ['/localizacao', '/ace-historico', '/ace-perfil', '/visita'].some(
    path => location.pathname.startsWith(path)
  );
  
  // For mobile, sidebar is collapsed by default
  useEffect(() => {
    setCollapsed(isMobile);
  }, [isMobile]);

  const toggleSidebar = () => {
    setCollapsed(!collapsed);
  };

  // For mobile app routes, use a full-screen layout without sidebar or header
  if (isMobileAppRoute && isMobile) {
    return (
      <div className="h-screen w-full bg-background">
        <main className="flex-1 overflow-auto">
          <Outlet />
        </main>
      </div>
    );
  }

  return (
    <div className="flex h-screen w-full bg-background">
      <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />
      
      <div
        className={cn(
          "flex flex-col flex-1 transition-all duration-300 ease-in-out",
          collapsed ? "ml-[70px]" : "ml-[250px]",
          isMobile && "ml-0"
        )}
      >
        <Header toggleSidebar={toggleSidebar} />
        
        <main className="flex-1 overflow-auto p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
