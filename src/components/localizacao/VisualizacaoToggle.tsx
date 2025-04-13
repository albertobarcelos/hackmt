
import React from "react";
import { Button } from "@/components/ui/button";
import { Search, Map } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";

const VisualizacaoToggle: React.FC = () => {
  const navigate = useNavigate();
  
  return (
    <div className="mt-4 flex justify-center">
      <Button
        className="flex items-center gap-2"
        variant="outline"
        onClick={() => navigate('/localizacao')}
      >
        <Search size={16} />
        <span>Ver em lista</span>
      </Button>
    </div>
  );
};

export default VisualizacaoToggle;
