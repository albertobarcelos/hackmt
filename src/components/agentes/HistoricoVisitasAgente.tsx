
import React from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { MapPin, Calendar, AlertCircle } from "lucide-react";

interface Visita {
  id: string;
  endereco: string;
  data: string;
  situacao: string;
  pendencia: boolean;
}

interface HistoricoVisitasAgenteProps {
  visitas: Visita[];
}

const HistoricoVisitasAgente: React.FC<HistoricoVisitasAgenteProps> = ({ visitas }) => {
  if (!visitas || visitas.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        Nenhuma visita registrada para este agente.
      </div>
    );
  }

  return (
    <div className="border rounded-md overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Endereço</TableHead>
            <TableHead>Data</TableHead>
            <TableHead>Situação</TableHead>
            <TableHead>Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {visitas.map((visita) => (
            <TableRow key={visita.id}>
              <TableCell>
                <div className="flex items-center gap-2">
                  <MapPin size={16} className="text-blue-500" />
                  <span>{visita.endereco}</span>
                </div>
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <Calendar size={16} className="text-gray-500" />
                  <span>{new Date(visita.data).toLocaleDateString("pt-BR")}</span>
                </div>
              </TableCell>
              <TableCell>
                <Badge
                  variant={visita.situacao === "Concluída" ? "default" : "outline"}
                  className={visita.situacao === "Concluída" ? "bg-green-500" : ""}
                >
                  {visita.situacao}
                </Badge>
              </TableCell>
              <TableCell>
                {visita.pendencia && (
                  <div className="flex items-center gap-1 text-amber-600">
                    <AlertCircle size={16} />
                    <span className="text-xs">Pendência</span>
                  </div>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default HistoricoVisitasAgente;
