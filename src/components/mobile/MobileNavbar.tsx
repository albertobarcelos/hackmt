
import React from "react";
import { useNavigate } from "react-router-dom";
import { ClipboardList, History, User } from "lucide-react";

interface MobileNavbarProps {
  currentPath: "visitas" | "historico" | "perfil";
}

const MobileNavbar: React.FC<MobileNavbarProps> = ({ currentPath }) => {
  const navigate = useNavigate();
  
  const navItems = [
    {
      id: "visitas",
      label: "Visitas",
      icon: <ClipboardList size={20} />,
      path: "/localizacao"
    },
    {
      id: "historico",
      label: "Histórico",
      icon: <History size={20} />,
      path: "/ace-historico"
    },
    {
      id: "perfil",
      label: "Perfil",
      icon: <User size={20} />,
      path: "/ace-perfil"
    }
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg z-50">
      <div className="flex justify-around items-center h-14 px-2 max-w-sm mx-auto">
        {navItems.map(item => (
          <button
            key={item.id}
            className={`flex flex-col items-center justify-center px-2 ${
              currentPath === item.id 
                ? "text-blue-600" 
                : "text-gray-500 hover:text-blue-500"
            }`}
            onClick={() => navigate(item.path)}
          >
            {item.icon}
            <span className="text-[10px] mt-0.5">{item.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default MobileNavbar;
