
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Calendar, Clock, Clipboard } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

export interface VisitaHistorico {
  id: string;
  casaId: string;
  endereco: string;
  dataVisita: Date;
  tempoVisita: number;
  nome_agente: string;
  situacao_imovel: string;
}

interface HistoricoVisitasProps {
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

const HistoricoVisitas: React.FC<HistoricoVisitasProps> = ({ visitas, onVerDetalhes }) => {
  const formatarTempo = (segundos: number): string => {
    const minutos = Math.floor(segundos / 60);
    const segundosRestantes = segundos % 60;
    return `${minutos}m ${segundosRestantes}s`;
  };

  return (
    <Card className="shadow-md">
      <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50">
        <CardTitle className="flex items-center gap-2 text-blue-900">
          <Calendar className="h-5 w-5" />
          Histórico de Visitas
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        {visitas.length > 0 ? (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Data</TableHead>
                  <TableHead>Endereço</TableHead>
                  <TableHead>Situação</TableHead>
                  <TableHead>Agente</TableHead>
                  <TableHead>Duração</TableHead>
                  <TableHead>Detalhes</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {visitas.map((visita) => (
                  <TableRow key={visita.id}>
                    <TableCell>
                      {format(new Date(visita.dataVisita), "dd/MM/yyyy", { locale: ptBR })}
                    </TableCell>
                    <TableCell className="max-w-[150px] truncate">{visita.endereco}</TableCell>
                    <TableCell>{mapearSituacaoImovel(visita.situacao_imovel)}</TableCell>
                    <TableCell className="max-w-[100px] truncate">{visita.nome_agente}</TableCell>
                    <TableCell className="whitespace-nowrap">
                      <div className="flex items-center gap-1">
                        <Clock className="h-3 w-3 text-gray-500" />
                        {formatarTempo(visita.tempoVisita)}
                      </div>
                    </TableCell>
                    <TableCell>
                      <button 
                        className="flex items-center text-blue-600 hover:text-blue-800 text-sm"
                        onClick={() => onVerDetalhes(visita.id)}
                      >
                        <Clipboard className="h-4 w-4 mr-1" />
                        Ver
                      </button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        ) : (
          <div className="p-8 text-center text-gray-500">
            Nenhum registro de visita encontrado.
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default HistoricoVisitas;
