
import React from "react";
import { Button } from "@/components/ui/button";
import { MapPin } from "lucide-react";
import { Bairro } from "@/types/bairro";

interface BairroSelectorButtonsProps {
  bairros: Bairro[];
  bairroSelecionado: string | null;
  onBairroSelect: (bairroId: string) => void;
  onResetMapa: () => void;
}

const BairroSelectorButtons: React.FC<BairroSelectorButtonsProps> = ({
  bairros,
  bairroSelecionado,
  onBairroSelect,
  onResetMapa,
}) => {
  return (
    <div className="flex flex-wrap gap-2 mb-4">
      {bairros.map((bairro) => (
        <Button
          key={bairro.id}
          variant={bairroSelecionado === bairro.id ? "default" : "outline"}
          size="sm"
          className="flex items-center gap-1"
          onClick={() => onBairroSelect(bairro.id)}
        >
          <MapPin size={16} />
          {bairro.nome}
        </Button>
      ))}
      {bairroSelecionado && (
        <Button variant="ghost" size="sm" onClick={onResetMapa}>
          Visão Geral
        </Button>
      )}
    </div>
  );
};

export default BairroSelectorButtons;
