
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
    <div className="space-y-3">
      {casas.map((casa) => (
        <Card key={casa.id} className="hover:shadow-md transition-shadow">
          <CardContent className="p-4">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-medium">{casa.endereco}, {casa.numero}</h3>
                {casa.referencia && (
                  <p className="text-sm text-gray-600">Ref: {casa.referencia}</p>
                )}
              </div>
              <div className="flex gap-2">
                {temHistoricoVisitas(casa.id) && (
                  <Button 
                    className="bg-blue-500 hover:bg-blue-600"
                    onClick={() => onAbrirHistorico(casa.id)}
                    title="Ver histórico de visitas"
                  >
                    <Clock className="h-4 w-4" />
                    <span className="sr-only md:not-sr-only md:ml-2">Histórico</span>
                  </Button>
                )}
                <Button 
                  className="bg-green-500 hover:bg-green-600"
                  onClick={() => onAbrirFormulario(casa.id)}
                >
                  <ArrowRight className="h-4 w-4 mr-1" />
                  Visitar
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
