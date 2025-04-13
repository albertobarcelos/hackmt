
import React from "react";
import { Button } from "@/components/ui/button";
import { Search, Map } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";

const VisualizacaoToggle: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const isMapPage = location.pathname.includes("mapa");
  
  return (
    <div className="mt-4 flex justify-center">
      <Button
        className="flex items-center gap-2"
        variant="outline"
        onClick={() => navigate(isMapPage ? '/localizacao' : '/localizacao-mapa')}
      >
        {isMapPage ? (
          <>
            <Search size={16} />
            <span>Ver em lista</span>
          </>
        ) : (
          <>
            <Map size={16} />
            <span>Ver no mapa</span>
          </>
        )}
      </Button>
    </div>
  );
};

export default VisualizacaoToggle;
