
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight, Clock } from "lucide-react";

interface Casa {
  id: string;
  endereco: string;
  numero: string;
  referencia?: string;
}

interface ListaCasasProps {
  casas: Casa[];
  temHistoricoVisitas: (casaId: string) => boolean;
  onAbrirFormulario: (casaId: string) => void;
  onAbrirHistorico: (casaId: string) => void;
}

const ListaCasas: React.FC<ListaCasasProps> = ({
  casas,
  temHistoricoVisitas,
  onAbrirFormulario,
  onAbrirHistorico
}) => {
  return (
    <div className="space-y-2">
      {casas.map((casa) => (
        <Card key={casa.id} className="hover:shadow-md transition-shadow">
          <CardContent className="p-3">
            <div className="flex flex-col">
              <div className="mb-2">
                <h3 className="text-sm font-medium">{casa.endereco}, {casa.numero}</h3>
                {casa.referencia && (
                  <p className="text-xs text-gray-600">Ref: {casa.referencia}</p>
                )}
              </div>
              <div className="flex gap-2 justify-end">
                {temHistoricoVisitas(casa.id) && (
                  <Button 
                    className="bg-blue-500 hover:bg-blue-600 h-8 px-2"
                    onClick={() => onAbrirHistorico(casa.id)}
                    title="Ver histórico de visitas"
                  >
                    <Clock className="h-3 w-3" />
                    <span className="text-xs ml-1">Histórico</span>
                  </Button>
                )}
                <Button 
                  className="bg-green-500 hover:bg-green-600 h-8 px-2"
                  onClick={() => onAbrirFormulario(casa.id)}
                >
                  <ArrowRight className="h-3 w-3 mr-1" />
                  <span className="text-xs">Visitar</span>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default ListaCasas;
