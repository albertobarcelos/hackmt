
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Calendar, Clock, Clipboard, Home } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { VisitaHistorico } from "./HistoricoVisitas";

interface HistoricoVisitasMobileProps {
  visitas: VisitaHistorico[];
  onVerDetalhes: (visitaId: string) => void;
}

const mapearSituacaoImovel = (codigo: string): string => {
  const situacoes: Record<string, string> = {
    "F": "Fechado",
    "R": "Recusado",
    "N": "Normal",
    "P": "Ponto Estratégico",
    "T": "Terreno Baldio"
  };
  
  return situacoes[codigo] || codigo;
};

const HistoricoVisitasMobile: React.FC<HistoricoVisitasMobileProps> = ({ visitas, onVerDetalhes }) => {
  const formatarTempo = (segundos: number): string => {
    const minutos = Math.floor(segundos / 60);
    const segundosRestantes = segundos % 60;
    return `${minutos}m ${segundosRestantes}s`;
  };

  return (
    <div className="space-y-3">
      {visitas.length > 0 ? (
        visitas.map((visita) => (
          <Card key={visita.id} className="mb-2 overflow-hidden">
            <CardContent className="p-3">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-1.5">
                  <Calendar className="h-4 w-4 text-blue-500" />
                  <span className="text-sm font-medium">
                    {format(new Date(visita.dataVisita), "dd/MM/yyyy", { locale: ptBR })}
                  </span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Clock className="h-3.5 w-3.5 text-gray-500" />
                  <span className="text-xs text-gray-500">
                    {formatarTempo(visita.tempoVisita)}
                  </span>
                </div>
              </div>
              
              <div className="mb-2">
                <div className="flex items-start gap-1.5">
                  <Home className="h-4 w-4 text-gray-600 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium line-clamp-1">{visita.endereco}</p>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="px-2 py-0.5 bg-blue-50 text-blue-800 text-xs rounded-full">
                  {mapearSituacaoImovel(visita.situacao_imovel)}
                </div>
                
                <button 
                  className="flex items-center text-blue-600 text-xs p-1"
                  onClick={() => onVerDetalhes(visita.id)}
                >
                  <Clipboard className="h-3.5 w-3.5 mr-1" />
                  Detalhes
                </button>
              </div>
            </CardContent>
          </Card>
        ))
      ) : (
        <div className="p-8 text-center text-gray-500">
          Nenhum registro de visita encontrado.
        </div>
      )}
    </div>
  );
};

export default HistoricoVisitasMobile;
