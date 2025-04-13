
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { MapPin, Phone, Mail, Award, Calendar, Clock } from "lucide-react";

const PerfilPage = () => {
  // Dados fictícios do agente (em produção viriam de uma API)
  const agente = {
    nome: "João Silva",
    email: "joao.silva@saude.gov.br",
    telefone: "(11) 99999-1234",
    area: "Centro",
    matricula: "ACE-001",
    dataContratacao: "2023-01-15",
    visitas: 145,
    ultimaVisita: "2023-05-10"
  };

  return (
    <div className="p-4">
      <h2 className="text-lg font-semibold mb-4 text-blue-800">Meu Perfil</h2>
      
      <Card className="mb-4">
        <CardHeader className="pb-2">
          <div className="flex items-center gap-4">
            <Avatar className="h-16 w-16 border-2 border-primary">
              <AvatarImage src="" />
              <AvatarFallback className="bg-primary text-white text-lg">
                {agente.nome.split(" ").map(n => n[0]).join("")}
              </AvatarFallback>
            </Avatar>
            <div>
              <CardTitle className="text-lg">{agente.nome}</CardTitle>
              <p className="text-sm text-muted-foreground">{agente.matricula}</p>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4 pt-2">
          <div className="grid grid-cols-1 gap-3">
            <div className="flex items-center gap-3">
              <MapPin className="h-4 w-4 text-blue-600" />
              <span className="text-sm">{agente.area}</span>
            </div>
            <div className="flex items-center gap-3">
              <Phone className="h-4 w-4 text-blue-600" />
              <span className="text-sm">{agente.telefone}</span>
            </div>
            <div className="flex items-center gap-3">
              <Mail className="h-4 w-4 text-blue-600" />
              <span className="text-sm">{agente.email}</span>
            </div>
            <div className="flex items-center gap-3">
              <Calendar className="h-4 w-4 text-blue-600" />
              <div>
                <span className="text-sm">Contratado em </span>
                <span className="text-sm font-medium">
                  {new Date(agente.dataContratacao).toLocaleDateString("pt-BR")}
                </span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base flex items-center gap-2">
            <Award className="h-4 w-4" />
            Estatísticas
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-2">
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-slate-50 rounded-md p-3">
              <div className="text-sm text-muted-foreground">Total de Visitas</div>
              <div className="text-xl font-bold mt-1">{agente.visitas}</div>
            </div>
            <div className="bg-slate-50 rounded-md p-3">
              <div className="text-sm text-muted-foreground">Última Visita</div>
              <div className="text-base font-medium mt-1">
                {new Date(agente.ultimaVisita).toLocaleDateString("pt-BR")}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PerfilPage;
