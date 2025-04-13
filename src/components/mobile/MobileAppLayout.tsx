
import React from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { Home, Clock, User, Book } from "lucide-react";

const MobileAppLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  const isActive = (path: string) => {
    return location.pathname === path;
  };
  
  return (
    <div className="flex flex-col h-screen w-full bg-background max-w-[375px] mx-auto shadow-lg overflow-hidden border-x border-gray-200">
      {/* Header */}
      <header className="bg-primary text-primary-foreground p-4 text-center shadow">
        <h1 className="text-lg font-medium">Visita Agíl</h1>
      </header>
      
      {/* Content area */}
      <main className="flex-1 overflow-auto pb-16">
        <Outlet />
      </main>
      
      {/* Bottom navigation */}
      <nav className="fixed bottom-0 left-0 right-0 max-w-[375px] mx-auto h-16 bg-white border-t border-gray-200 flex items-center justify-around px-2 z-10">
        <button onClick={() => navigate("/app-ace")} className={`flex flex-col items-center justify-center w-1/4 h-full ${isActive("/app-ace") ? "text-primary" : "text-gray-500"}`}>
          <Home size={24} />
          <span className="text-xs mt-1">Visitas</span>
        </button>
        
        <button onClick={() => navigate("/app-ace/historico")} className={`flex flex-col items-center justify-center w-1/4 h-full ${isActive("/app-ace/historico") ? "text-primary" : "text-gray-500"}`}>
          <Clock size={24} />
          <span className="text-xs mt-1">Histórico</span>
        </button>
        
        <button onClick={() => navigate("/app-ace/treinamento")} className={`flex flex-col items-center justify-center w-1/4 h-full ${isActive("/app-ace/treinamento") ? "text-primary" : "text-gray-500"}`}>
          <Book size={24} />
          <span className="text-xs mt-1">Treinamento</span>
        </button>
        
        <button onClick={() => navigate("/app-ace/perfil")} className={`flex flex-col items-center justify-center w-1/4 h-full ${isActive("/app-ace/perfil") ? "text-primary" : "text-gray-500"}`}>
          <User size={24} />
          <span className="text-xs mt-1">Perfil</span>
        </button>
      </nav>
    </div>
  );
};

export default MobileAppLayout;
