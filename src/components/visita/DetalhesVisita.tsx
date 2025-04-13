
import React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Clock, Calendar, User, FileText, AlertCircle, Home } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

export interface DetalhesVisitaData {
  id: string;
  casaId: string;
  endereco: string;
  dataVisita: Date;
  tempoVisita: number;
  nome_agente: string;
  supervisor: string;
  tipo_imovel: string;
  situacao_imovel: string;
  depositos_A1: number;
  depositos_A2: number;
  depositos_B: number;
  depositos_C: number;
  depositos_D1: number;
  depositos_D2: number;
  depositos_E: number;
  pendencia?: string;
  larvicida_utilizado: string;
  adulticida_utilizado: string;
  quantidade_larvicida: number;
  depositos_tratados: number;
  coleta_amostras: string;
  amostras_enviadas: number;
  observacoes_gerais?: string;
}

interface DetalhesVisitaProps {
  visita: DetalhesVisitaData;
  onFechar: () => void;
}

const mapearTipoImovel = (codigo: string): string => {
  const tipos: Record<string, string> = {
    "R": "Residencial",
    "C": "Comercial",
    "P": "Ponto Estratégico",
    "T": "Terreno Baldio",
    "O": "Outros"
  };
  
  return tipos[codigo] || codigo;
};

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

const formatarTempo = (segundos: number): string => {
  const minutos = Math.floor(segundos / 60);
  const segundosRestantes = segundos % 60;
  return `${minutos} minutos e ${segundosRestantes} segundos`;
};

const DetalhesVisita: React.FC<DetalhesVisitaProps> = ({ visita, onFechar }) => {
  return (
    <Card className="max-w-3xl mx-auto shadow-lg">
      <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50">
        <CardTitle className="text-xl text-blue-900 flex items-center gap-2">
          <FileText className="h-5 w-5" />
          Detalhes da Visita
        </CardTitle>
        <div className="text-sm text-gray-600">
          <div className="flex items-center gap-2 mb-1">
            <Home className="h-4 w-4" />
            {visita.endereco}
          </div>
          <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs">
            <div className="flex items-center gap-1">
              <Calendar className="h-3 w-3" />
              {format(new Date(visita.dataVisita), "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}
            </div>
            <div className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              {formatarTempo(visita.tempoVisita)}
            </div>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="font-medium text-blue-900 mb-2">Informações do Imóvel</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Tipo:</span>
                <span className="font-medium">{mapearTipoImovel(visita.tipo_imovel)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Situação:</span>
                <span className="font-medium">{mapearSituacaoImovel(visita.situacao_imovel)}</span>
              </div>
            </div>
            
            <h3 className="font-medium text-blue-900 mt-4 mb-2">Depósitos Encontrados</h3>
            <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">A1:</span>
                <span>{visita.depositos_A1}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">A2:</span>
                <span>{visita.depositos_A2}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">B:</span>
                <span>{visita.depositos_B}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">C:</span>
                <span>{visita.depositos_C}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">D1:</span>
                <span>{visita.depositos_D1}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">D2:</span>
                <span>{visita.depositos_D2}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">E:</span>
                <span>{visita.depositos_E}</span>
              </div>
            </div>
          </div>
          
          <div>
            <h3 className="font-medium text-blue-900 mb-2">Tratamento</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Larvicida:</span>
                <span>{visita.larvicida_utilizado}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Adulticida:</span>
                <span>{visita.adulticida_utilizado}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Quantidade Larvicida:</span>
                <span>{visita.quantidade_larvicida}g</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Depósitos Tratados:</span>
                <span>{visita.depositos_tratados}</span>
              </div>
            </div>
            
            <h3 className="font-medium text-blue-900 mt-4 mb-2">Amostras</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Coleta Realizada:</span>
                <span>{visita.coleta_amostras}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Amostras Enviadas:</span>
                <span>{visita.amostras_enviadas}</span>
              </div>
            </div>
          </div>
        </div>
        
        <div className="mt-6 space-y-4">
          <div>
            <h3 className="font-medium text-blue-900 mb-1">Responsáveis</h3>
            <div className="text-sm grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-start gap-2">
                <User className="h-4 w-4 text-blue-700 mt-0.5" />
                <div>
                  <div className="text-gray-600">Agente:</div>
                  <div className="font-medium">{visita.nome_agente}</div>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <User className="h-4 w-4 text-blue-700 mt-0.5" />
                <div>
                  <div className="text-gray-600">Supervisor:</div>
                  <div className="font-medium">{visita.supervisor}</div>
                </div>
              </div>
            </div>
          </div>
          
          {visita.pendencia && (
            <div>
              <h3 className="font-medium text-blue-900 mb-1 flex items-center gap-1">
                <AlertCircle className="h-4 w-4 text-amber-500" />
                Pendência
              </h3>
              <p className="text-sm bg-amber-50 p-2 rounded border border-amber-100">
                {visita.pendencia}
              </p>
            </div>
          )}
          
          {visita.observacoes_gerais && (
            <div>
              <h3 className="font-medium text-blue-900 mb-1">Observações</h3>
              <p className="text-sm bg-gray-50 p-2 rounded border border-gray-100">
                {visita.observacoes_gerais}
              </p>
            </div>
          )}
        </div>
      </CardContent>
      
      <CardFooter className="flex justify-end bg-gray-50 py-3">
        <Button onClick={onFechar}>Fechar</Button>
      </CardFooter>
    </Card>
  );
};

export default DetalhesVisita;
