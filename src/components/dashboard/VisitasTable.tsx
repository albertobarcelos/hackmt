import React, { useState } from "react";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { 
  Check, 
  Search, 
  Clipboard, 
  AlertCircle, 
  XCircle,
  ChevronLeft,
  ChevronRight
} from "lucide-react";
import { DateRange } from "react-day-picker";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import DetalhesVisita, { DetalhesVisitaData } from "@/components/visita/DetalhesVisita";

interface VisitasTableProps {
  dateRange: DateRange;
  bairro: string | null;
}

interface Visita {
  id: string;
  endereco: string;
  numero: string;
  bairro: string;
  dataVisita: Date | null;
  situacao: "visitado" | "naoVisitado" | "pendente";
  observacao?: string;
  detalhes?: DetalhesVisitaData;
}

const VisitasTable: React.FC<VisitasTableProps> = ({ dateRange, bairro }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedVisita, setSelectedVisita] = useState<DetalhesVisitaData | null>(null);
  const itemsPerPage = 10;

  const visitas: Visita[] = [
    {
      id: "1",
      endereco: "Av. Paulista",
      numero: "1578",
      bairro: "Centro",
      dataVisita: new Date(2023, 3, 15),
      situacao: "visitado",
      detalhes: {
        id: "1",
        casaId: "casa1",
        endereco: "Av. Paulista, 1578 - Centro",
        dataVisita: new Date(2023, 3, 15),
        tempoVisita: 645,
        nome_agente: "João Silva",
        supervisor: "Carlos Mendes",
        tipo_imovel: "R",
        situacao_imovel: "N",
        depositos_A1: 2,
        depositos_A2: 1,
        depositos_B: 3,
        depositos_C: 0,
        depositos_D1: 1,
        depositos_D2: 0,
        depositos_E: 0,
        larvicida_utilizado: "Pyriproxyfen",
        adulticida_utilizado: "Não utilizado",
        quantidade_larvicida: 25,
        depositos_tratados: 3,
        coleta_amostras: "Sim",
        amostras_enviadas: 2,
        observacoes_gerais: "Moradores cooperativos."
      }
    },
    {
      id: "2",
      endereco: "Rua Augusta",
      numero: "456",
      bairro: "Centro",
      dataVisita: new Date(2023, 3, 16),
      situacao: "visitado",
      detalhes: {
        id: "2",
        casaId: "casa2",
        endereco: "Rua Augusta, 456 - Centro",
        dataVisita: new Date(2023, 3, 16),
        tempoVisita: 580,
        nome_agente: "Ana Souza",
        supervisor: "Carlos Mendes",
        tipo_imovel: "C",
        situacao_imovel: "N",
        depositos_A1: 0,
        depositos_A2: 0,
        depositos_B: 1,
        depositos_C: 2,
        depositos_D1: 0,
        depositos_D2: 0,
        depositos_E: 0,
        larvicida_utilizado: "Pyriproxyfen",
        adulticida_utilizado: "Não utilizado",
        quantidade_larvicida: 15,
        depositos_tratados: 1,
        coleta_amostras: "Não",
        amostras_enviadas: 0,
        observacoes_gerais: "Local limpo e bem cuidado."
      }
    },
    {
      id: "3",
      endereco: "Rua Oscar Freire",
      numero: "123",
      bairro: "Jardim São Paulo",
      dataVisita: new Date(2023, 3, 14),
      situacao: "visitado",
      detalhes: {
        id: "3",
        casaId: "casa3",
        endereco: "Rua Oscar Freire, 123 - Jardim São Paulo",
        dataVisita: new Date(2023, 3, 14),
        tempoVisita: 720,
        nome_agente: "Pedro Alves",
        supervisor: "Carlos Mendes",
        tipo_imovel: "R",
        situacao_imovel: "N",
        depositos_A1: 3,
        depositos_A2: 2,
        depositos_B: 1,
        depositos_C: 0,
        depositos_D1: 2,
        depositos_D2: 1,
        depositos_E: 0,
        larvicida_utilizado: "Pyriproxyfen",
        adulticida_utilizado: "Delta Plus",
        quantidade_larvicida: 35,
        depositos_tratados: 5,
        coleta_amostras: "Sim",
        amostras_enviadas: 3,
        pendencia: "Retorno em 7 dias para verificação de eficácia",
        observacoes_gerais: "Vários focos encontrados."
      }
    },
    {
      id: "4",
      endereco: "Av. Brasil",
      numero: "789",
      bairro: "Santa Luzia",
      dataVisita: null,
      situacao: "naoVisitado",
      observacao: "Programado para próxima semana"
    },
    {
      id: "5",
      endereco: "Rua das Flores",
      numero: "234",
      bairro: "Vila Nova",
      dataVisita: new Date(2023, 3, 17),
      situacao: "pendente",
      observacao: "Imóvel fechado, retorno agendado"
    },
    {
      id: "6",
      endereco: "Alameda Santos",
      numero: "567",
      bairro: "Centro",
      dataVisita: null,
      situacao: "naoVisitado"
    },
    {
      id: "7",
      endereco: "Rua 25 de Março",
      numero: "890",
      bairro: "Centro",
      dataVisita: new Date(2023, 3, 15),
      situacao: "pendente",
      observacao: "Acesso recusado pelo morador"
    },
    {
      id: "8",
      endereco: "Av. Paulista",
      numero: "2000",
      bairro: "Centro",
      dataVisita: new Date(2023, 3, 16),
      situacao: "visitado",
      detalhes: {
        id: "8",
        casaId: "casa8",
        endereco: "Av. Paulista, 2000 - Centro",
        dataVisita: new Date(2023, 3, 16),
        tempoVisita: 550,
        nome_agente: "Maria Santos",
        supervisor: "Carlos Mendes",
        tipo_imovel: "C",
        situacao_imovel: "N",
        depositos_A1: 0,
        depositos_A2: 0,
        depositos_B: 0,
        depositos_C: 1,
        depositos_D1: 0,
        depositos_D2: 0,
        depositos_E: 0,
        larvicida_utilizado: "Não utilizado",
        adulticida_utilizado: "Não utilizado",
        quantidade_larvicida: 0,
        depositos_tratados: 0,
        coleta_amostras: "Não",
        amostras_enviadas: 0,
        observacoes_gerais: "Sem problemas identificados."
      }
    },
    {
      id: "9",
      endereco: "Rua Consolação",
      numero: "1234",
      bairro: "Jardim São Paulo",
      dataVisita: null,
      situacao: "naoVisitado"
    },
    {
      id: "10",
      endereco: "Av. Brigadeiro",
      numero: "4321",
      bairro: "Jardim São Paulo",
      dataVisita: new Date(2023, 3, 17),
      situacao: "visitado",
      detalhes: {
        id: "10",
        casaId: "casa10",
        endereco: "Av. Brigadeiro, 4321 - Jardim São Paulo",
        dataVisita: new Date(2023, 3, 17),
        tempoVisita: 630,
        nome_agente: "Lucas Ferreira",
        supervisor: "Carlos Mendes",
        tipo_imovel: "R",
        situacao_imovel: "N",
        depositos_A1: 1,
        depositos_A2: 1,
        depositos_B: 2,
        depositos_C: 0,
        depositos_D1: 0,
        depositos_D2: 0,
        depositos_E: 0,
        larvicida_utilizado: "Pyriproxyfen",
        adulticida_utilizado: "Não utilizado",
        quantidade_larvicida: 20,
        depositos_tratados: 2,
        coleta_amostras: "Sim",
        amostras_enviadas: 1,
        observacoes_gerais: "Situação sob controle."
      }
    },
    {
      id: "11",
      endereco: "Rua Liberdade",
      numero: "555",
      bairro: "Santa Luzia",
      dataVisita: new Date(2023, 3, 14),
      situacao: "pendente",
      observacao: "Imóvel em obras, acesso restrito"
    },
    {
      id: "12",
      endereco: "Av. Rebouças",
      numero: "777",
      bairro: "Santo Antônio",
      dataVisita: new Date(2023, 3, 15),
      situacao: "visitado",
      detalhes: {
        id: "12",
        casaId: "casa12",
        endereco: "Av. Rebouças, 777 - Santo Antônio",
        dataVisita: new Date(2023, 3, 15),
        tempoVisita: 540,
        nome_agente: "Roberto Dias",
        supervisor: "Carlos Mendes",
        tipo_imovel: "P",
        situacao_imovel: "N",
        depositos_A1: 4,
        depositos_A2: 2,
        depositos_B: 3,
        depositos_C: 1,
        depositos_D1: 2,
        depositos_D2: 1,
        depositos_E: 0,
        larvicida_utilizado: "Pyriproxyfen",
        adulticida_utilizado: "Delta Plus",
        quantidade_larvicida: 45,
        depositos_tratados: 8,
        coleta_amostras: "Sim",
        amostras_enviadas: 4,
        pendencia: "Acompanhamento semanal necessário",
        observacoes_gerais: "Ponto estratégico com alto risco de infestação."
      }
    }
  ];

  const filteredVisitas = visitas.filter(visita => 
    (bairro ? visita.bairro === bairro : true) &&
    (visita.endereco.toLowerCase().includes(searchTerm.toLowerCase()) ||
     visita.numero.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const paginatedVisitas = filteredVisitas.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const totalPages = Math.ceil(filteredVisitas.length / itemsPerPage);

  const getStatusBadge = (situacao: string) => {
    switch (situacao) {
      case "visitado":
        return <Badge className="bg-green-500">Visitado</Badge>;
      case "naoVisitado":
        return <Badge className="bg-red-500">Não Visitado</Badge>;
      case "pendente":
        return <Badge className="bg-yellow-500">Pendente</Badge>;
      default:
        return null;
    }
  };

  const handleVerDetalhes = (visita: Visita) => {
    if (visita.detalhes) {
      setSelectedVisita(visita.detalhes);
    }
  };

  const fecharDetalhes = () => {
    setSelectedVisita(null);
  };

  return (
    <div className="w-full">
      <div className="p-4 border-b">
        <div className="relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Buscar por endereço..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
          />
        </div>
      </div>

      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Endereço</TableHead>
              <TableHead>Nº</TableHead>
              {!bairro && <TableHead>Bairro</TableHead>}
              <TableHead>Status</TableHead>
              <TableHead>Data da Visita</TableHead>
              <TableHead>Observação</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedVisitas.length > 0 ? (
              paginatedVisitas.map((visita) => (
                <TableRow key={visita.id}>
                  <TableCell>{visita.endereco}</TableCell>
                  <TableCell>{visita.numero}</TableCell>
                  {!bairro && <TableCell>{visita.bairro}</TableCell>}
                  <TableCell>{getStatusBadge(visita.situacao)}</TableCell>
                  <TableCell>
                    {visita.dataVisita 
                      ? format(visita.dataVisita, "dd/MM/yyyy", { locale: ptBR })
                      : "-"}
                  </TableCell>
                  <TableCell>
                    {visita.observacao ? (
                      <div className="flex items-center gap-1">
                        <AlertCircle className="h-3 w-3 text-amber-500" />
                        <span className="text-xs truncate max-w-[150px]">
                          {visita.observacao}
                        </span>
                      </div>
                    ) : "-"}
                  </TableCell>
                  <TableCell className="text-right">
                    {visita.situacao === "visitado" && visita.detalhes ? (
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => handleVerDetalhes(visita)}
                      >
                        <Clipboard className="h-4 w-4 mr-1" />
                        Detalhes
                      </Button>
                    ) : (
                      <Button 
                        variant="ghost" 
                        size="sm"
                        disabled
                      >
                        <XCircle className="h-4 w-4 mr-1" />
                        Indisponível
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell 
                  colSpan={bairro ? 6 : 7} 
                  className="h-24 text-center"
                >
                  Nenhum resultado encontrado.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-between p-4">
          <div className="text-sm text-muted-foreground">
            Mostrando {(currentPage - 1) * itemsPerPage + 1} a{" "}
            {Math.min(currentPage * itemsPerPage, filteredVisitas.length)} de{" "}
            {filteredVisitas.length} resultados
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
            >
              <ChevronLeft className="h-4 w-4" />
              <span className="sr-only">Página anterior</span>
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() =>
                setCurrentPage(Math.min(totalPages, currentPage + 1))
              }
              disabled={currentPage === totalPages}
            >
              <ChevronRight className="h-4 w-4" />
              <span className="sr-only">Próxima página</span>
            </Button>
          </div>
        </div>
      )}

      <Dialog open={!!selectedVisita} onOpenChange={() => selectedVisita && fecharDetalhes()}>
        <DialogContent className="max-w-4xl bg-transparent border-none shadow-none">
          {selectedVisita && (
            <DetalhesVisita 
              visita={selectedVisita} 
              onFechar={fecharDetalhes} 
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default VisitasTable;
