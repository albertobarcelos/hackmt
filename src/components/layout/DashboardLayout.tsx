
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
  
  // For mobile, sidebar is collapsed by default
  useEffect(() => {
    setCollapsed(isMobile);
  }, [isMobile]);

  const toggleSidebar = () => {
    setCollapsed(!collapsed);
  };

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
