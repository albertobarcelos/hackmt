
import React from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";

interface Bairro {
  id: string;
  nome: string;
  center: { lat: number; lng: number };
}

interface BairroSelectorProps {
  bairros: Bairro[];
  bairroSelecionado: string;
  onBairroChange: (value: string) => void;
}

const BairroSelector: React.FC<BairroSelectorProps> = ({
  bairros,
  bairroSelecionado,
  onBairroChange,
}) => {
  return (
    <Card className="mb-6">
      <CardContent className="pt-4">
        <div className="space-y-4">
          <label className="text-sm font-medium text-gray-700">Selecione um Bairro:</label>
          <Select value={bairroSelecionado} onValueChange={onBairroChange}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Escolha um bairro" />
            </SelectTrigger>
            <SelectContent>
              {bairros.map((bairro) => (
                <SelectItem key={bairro.id} value={bairro.id}>
                  {bairro.nome}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </CardContent>
    </Card>
  );
};

export default BairroSelector;
