
import React, { useState } from "react";
import { Badge } from "@/components/ui/badge";
import DataTable from "@/components/dashboard/DataTable";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { MapPin, Route } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import HistoricoVisitasAgente from "@/components/agentes/HistoricoVisitasAgente";
import { TableData } from "@/lib/types";

// Dados mockados para os agentes
const mockAgentes: TableData[] = [
  {
    id: "1",
    name: "João Silva",
    email: "joao.silva@saude.gov.br",
    area: "Centro",
    status: "Ativo",
    dataContratacao: "2023-01-15",
    ultimaVisita: "2023-05-10",
    totalVisitas: 145,
    pendencias: 2,
    matricula: "ACE-001",
    telefone: "(11) 99999-1234",
    avatarUrl: "https://github.com/shadcn.png",
  },
  {
    id: "2",
    name: "Maria Oliveira",
    email: "maria.oliveira@saude.gov.br",
    area: "Zona Leste",
    status: "Ativo",
    dataContratacao: "2023-02-22",
    ultimaVisita: "2023-05-18",
    totalVisitas: 132,
    pendencias: 0,
    matricula: "ACE-002",
    telefone: "(11) 99999-2345",
    avatarUrl: "",
  },
  {
    id: "3",
    name: "Roberto Almeida",
    email: "roberto.almeida@saude.gov.br",
    area: "Zona Sul",
    status: "Inativo",
    dataContratacao: "2023-03-10",
    ultimaVisita: "2023-04-30",
    totalVisitas: 87,
    pendencias: 5,
    matricula: "ACE-003",
    telefone: "(11) 99999-3456",
    avatarUrl: "",
  },
  {
    id: "4",
    name: "Camila Pereira",
    email: "camila.pereira@saude.gov.br",
    area: "Zona Norte",
    status: "Ativo",
    dataContratacao: "2023-04-05",
    ultimaVisita: "2023-05-19",
    totalVisitas: 122,
    pendencias: 1,
    matricula: "ACE-004",
    telefone: "(11) 99999-4567",
    avatarUrl: "",
  },
  {
    id: "5",
    name: "Luciana Souza",
    email: "luciana.souza@saude.gov.br",
    area: "Centro",
    status: "Ativo",
    dataContratacao: "2023-05-18",
    ultimaVisita: "2023-05-20",
    totalVisitas: 42,
    pendencias: 0,
    matricula: "ACE-005",
    telefone: "(11) 99999-5678",
    avatarUrl: "",
  },
  {
    id: "6",
    name: "Pedro Santos",
    email: "pedro.santos@saude.gov.br",
    area: "Zona Oeste",
    status: "Ativo",
    dataContratacao: "2023-06-23",
    ultimaVisita: "2023-05-17",
    totalVisitas: 98,
    pendencias: 3,
    matricula: "ACE-006",
    telefone: "(11) 99999-6789",
    avatarUrl: "",
  },
  {
    id: "7",
    name: "Ana Ferreira",
    email: "ana.ferreira@saude.gov.br",
    area: "Zona Leste",
    status: "Inativo",
    dataContratacao: "2023-07-11",
    ultimaVisita: "2023-04-25",
    totalVisitas: 65,
    pendencias: 2,
    matricula: "ACE-007",
    telefone: "(11) 99999-7890",
    avatarUrl: "",
  },
  {
    id: "8",
    name: "Carlos Ribeiro",
    email: "carlos.ribeiro@saude.gov.br",
    area: "Zona Sul",
    status: "Ativo",
    dataContratacao: "2023-08-09",
    ultimaVisita: "2023-05-18",
    totalVisitas: 110,
    pendencias: 0,
    matricula: "ACE-008",
    telefone: "(11) 99999-8901",
    avatarUrl: "",
  },
];

// Dados mockados para as visitas dos agentes
const mockVisitasAgentes = {
  "1": [
    { id: "v1", endereco: "Rua das Flores, 123", data: "2023-05-10", situacao: "Concluída", pendencia: false },
    { id: "v2", endereco: "Av. Brasil, 456", data: "2023-05-09", situacao: "Concluída", pendencia: false },
    { id: "v3", endereco: "Rua Treze de Maio, 789", data: "2023-05-08", situacao: "Pendente", pendencia: true },
    { id: "v4", endereco: "Av. Paulista, 1000", data: "2023-05-07", situacao: "Concluída", pendencia: false },
  ],
  "2": [
    { id: "v5", endereco: "Rua dos Girassóis, 234", data: "2023-05-18", situacao: "Concluída", pendencia: false },
    { id: "v6", endereco: "Av. das Nações, 567", data: "2023-05-17", situacao: "Concluída", pendencia: false },
    { id: "v7", endereco: "Rua Quinze, 890", data: "2023-05-16", situacao: "Concluída", pendencia: false },
  ],
};

const columns = [
  {
    key: "name",
    header: "Nome",
    cell: (agente: any) => (
      <div className="flex items-center gap-4">
        <Avatar className="h-8 w-8">
          <AvatarImage src={agente.avatarUrl} alt={agente.name} />
          <AvatarFallback>
            {agente.name.split(" ").map((n: string) => n[0]).join("")}
          </AvatarFallback>
        </Avatar>
        <div>
          <span className="font-medium block">{agente.name}</span>
          <span className="text-xs text-muted-foreground">Matrícula: {agente.matricula}</span>
        </div>
      </div>
    ),
  },
  {
    key: "area",
    header: "Área de Atuação",
    cell: (agente: any) => (
      <div className="flex items-center gap-2">
        <MapPin size={16} className="text-blue-500" />
        <span>{agente.area}</span>
      </div>
    ),
  },
  {
    key: "status",
    header: "Status",
    cell: (agente: any) => (
      <Badge
        variant={agente.status === "Ativo" ? "default" : "destructive"}
        className={`
          ${agente.status === "Ativo" ? "bg-green-500" : ""}
        `}
      >
        {agente.status}
      </Badge>
    ),
  },
  {
    key: "visitas",
    header: "Visitas",
    cell: (agente: any) => (
      <div className="flex flex-col">
        <span className="font-medium">{agente.totalVisitas}</span>
        <span className="text-xs text-muted-foreground">Última: {new Date(agente.ultimaVisita).toLocaleDateString("pt-BR")}</span>
      </div>
    ),
  },
  {
    key: "pendencias",
    header: "Pendências",
    cell: (agente: any) => (
      <Badge variant={agente.pendencias > 0 ? "destructive" : "outline"} className="ml-2">
        {agente.pendencias}
      </Badge>
    ),
  },
  {
    key: "actions",
    header: "Ações",
    cell: (agente: any) => (
      <Button 
        variant="outline"
        size="sm"
        className="flex items-center gap-1"
        onClick={() => console.log(`Definir rota para ${agente.name}`)}
      >
        <Route size={16} />
        <span>Definir Rota</span>
      </Button>
    ),
  },
];

const UsersPage: React.FC = () => {
  const [agenteDetalhesId, setAgenteDetalhesId] = useState<string | null>(null);
  const { toast } = useToast();
  
  const agenteSelecionado = agenteDetalhesId 
    ? mockAgentes.find(a => a.id === agenteDetalhesId) 
    : null;
  
  const visitasAgente = agenteDetalhesId 
    ? mockVisitasAgentes[agenteDetalhesId] || [] 
    : [];

  const handleAddUser = () => {
    toast({
      title: "Funcionalidade em desenvolvimento",
      description: "A adição de novos agentes estará disponível em breve.",
    });
  };

  const handleRowClick = (id: string) => {
    setAgenteDetalhesId(id);
  };

  const closeDetalhes = () => {
    setAgenteDetalhesId(null);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Agentes de Combate à Endemias</h1>
        <p className="text-muted-foreground mt-1">
          Gerenciamento de agentes e rotas de visitas
        </p>
      </div>

      <DataTable
        title="Gerenciamento de Agentes"
        data={mockAgentes}
        columns={columns}
        onAddNew={handleAddUser}
        onRowClick={handleRowClick}
      />

      {/* Modal de detalhes do agente */}
      <Dialog open={!!agenteDetalhesId} onOpenChange={closeDetalhes}>
        <DialogContent className="max-w-4xl bg-transparent border-none shadow-none">
          {agenteSelecionado && (
            <div className="bg-white p-6 rounded-lg shadow-lg">
              <div className="mb-6 flex justify-between items-center">
                <div className="flex items-center gap-4">
                  <Avatar className="h-16 w-16">
                    <AvatarImage src={agenteSelecionado.avatarUrl} alt={agenteSelecionado.name} />
                    <AvatarFallback className="text-lg">
                      {agenteSelecionado.name.split(" ").map((n: string) => n[0]).join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h2 className="text-2xl font-bold">{agenteSelecionado.name}</h2>
                    <p className="text-muted-foreground">{agenteSelecionado.email}</p>
                    <p className="text-sm">Matrícula: {agenteSelecionado.matricula}</p>
                  </div>
                </div>
                <Badge
                  variant={agenteSelecionado.status === "Ativo" ? "default" : "destructive"}
                  className={`
                    ${agenteSelecionado.status === "Ativo" ? "bg-green-500" : ""}
                    px-3 py-1 text-base
                  `}
                >
                  {agenteSelecionado.status}
                </Badge>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="bg-slate-50 p-3 rounded-lg">
                  <p className="text-sm text-muted-foreground">Área de Atuação</p>
                  <p className="font-medium">{agenteSelecionado.area}</p>
                </div>
                <div className="bg-slate-50 p-3 rounded-lg">
                  <p className="text-sm text-muted-foreground">Telefone</p>
                  <p className="font-medium">{agenteSelecionado.telefone}</p>
                </div>
                <div className="bg-slate-50 p-3 rounded-lg">
                  <p className="text-sm text-muted-foreground">Data de Contratação</p>
                  <p className="font-medium">{new Date(agenteSelecionado.dataContratacao).toLocaleDateString("pt-BR")}</p>
                </div>
              </div>
              
              <div className="bg-slate-50 p-4 rounded-lg mb-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Total de Visitas</p>
                    <p className="text-xl font-bold">{agenteSelecionado.totalVisitas}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Pendências</p>
                    <p className="text-xl font-bold">{agenteSelecionado.pendencias}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Última Visita</p>
                    <p className="text-xl font-bold">{new Date(agenteSelecionado.ultimaVisita).toLocaleDateString("pt-BR")}</p>
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="text-lg font-medium mb-4">Histórico de Visitas</h3>
                <HistoricoVisitasAgente visitas={visitasAgente} />
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default UsersPage;
