
import React, { useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { MapPin, Calendar, AlertCircle, Clipboard } from "lucide-react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import DetalhesVisita from "@/components/visita/DetalhesVisita";

interface Visita {
  id: string;
  endereco: string;
  data: string;
  situacao: string;
  pendencia: boolean;
  detalhes?: any; // Detalhes completos da visita
}

interface HistoricoVisitasAgenteProps {
  visitas: Visita[];
}

const HistoricoVisitasAgente: React.FC<HistoricoVisitasAgenteProps> = ({ visitas }) => {
  const [visitaSelecionada, setVisitaSelecionada] = useState<any | null>(null);
  
  const handleVerDetalhes = (detalhes: any) => {
    setVisitaSelecionada(detalhes);
  };
  
  const fecharDetalhes = () => {
    setVisitaSelecionada(null);
  };
  
  if (!visitas || visitas.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        Nenhuma visita registrada para este agente.
      </div>
    );
  }

  return (
    <>
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
                <TableCell className="space-x-2">
                  {visita.pendencia && (
                    <div className="flex items-center gap-1 text-amber-600 mb-2">
                      <AlertCircle size={16} />
                      <span className="text-xs">Pendência</span>
                    </div>
                  )}
                  {visita.detalhes && (
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => handleVerDetalhes(visita.detalhes)}
                      className="flex items-center gap-1"
                    >
                      <Clipboard className="h-4 w-4" />
                      Detalhes
                    </Button>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      
      {/* Modal de detalhes da visita */}
      <Dialog open={!!visitaSelecionada} onOpenChange={fecharDetalhes}>
        <DialogContent className="max-w-4xl bg-transparent border-none shadow-none">
          {visitaSelecionada && (
            <DetalhesVisita 
              visita={visitaSelecionada} 
              onFechar={fecharDetalhes} 
            />
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default HistoricoVisitasAgente;
