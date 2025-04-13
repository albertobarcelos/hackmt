
import React from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  CalendarClock, 
  Timer, 
  User, 
  MessageSquare, 
  Home, 
  ClipboardList, 
  AlertTriangle,
  Image,
  FileVideo
} from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

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
  pendencia?: string | null;
  larvicida_utilizado: string;
  adulticida_utilizado: string;
  quantidade_larvicida: number;
  depositos_tratados: number;
  coleta_amostras: string;
  amostras_enviadas: number;
  observacoes_gerais?: string | null;
  arquivos?: Array<{ url: string; tipo: 'foto' | 'video' }>;
}

interface DetalhesVisitaProps {
  visita: DetalhesVisitaData;
  onFechar: () => void;
}

const DetalhesVisita: React.FC<DetalhesVisitaProps> = ({ visita, onFechar }) => {
  // Função para formatar o tempo decorrido
  const formatarTempoDecorrido = (segundos: number) => {
    const minutos = Math.floor(segundos / 60);
    const segundosRestantes = segundos % 60;
    return `${minutos}min ${segundosRestantes}s`;
  };
  
  // Função para obter o texto do tipo de imóvel
  const getTipoImovelText = (codigo: string) => {
    const tipos: Record<string, string> = {
      'R': 'Residencial',
      'C': 'Comercial',
      'P': 'Ponto Estratégico',
      'T': 'Terreno Baldio',
      'O': 'Outros'
    };
    return tipos[codigo] || codigo;
  };
  
  // Função para obter o texto da situação do imóvel
  const getSituacaoImovelText = (codigo: string) => {
    const situacoes: Record<string, string> = {
      'F': 'Fechado',
      'R': 'Recusado',
      'N': 'Normal',
      'P': 'Ponto Estratégico',
      'T': 'Terreno Baldio'
    };
    return situacoes[codigo] || codigo;
  };
  
  // Calcular o total de depósitos encontrados
  const totalDepositos = 
    visita.depositos_A1 + 
    visita.depositos_A2 + 
    visita.depositos_B + 
    visita.depositos_C + 
    visita.depositos_D1 + 
    visita.depositos_D2 + 
    visita.depositos_E;
    
  // Verificar se há fotos ou vídeos
  const temArquivos = visita.arquivos && visita.arquivos.length > 0;
  const fotos = temArquivos ? visita.arquivos?.filter(a => a.tipo === 'foto') || [] : [];
  const videos = temArquivos ? visita.arquivos?.filter(a => a.tipo === 'video') || [] : [];

  return (
    <Card className="w-full max-w-4xl mx-auto shadow-lg overflow-hidden flex flex-col h-full max-h-full">
      <CardHeader className="bg-blue-50 shrink-0">
        <CardTitle className="text-xl text-blue-900">Detalhes da Visita</CardTitle>
        <p className="text-sm text-gray-600 mt-1">{visita.endereco}</p>
      </CardHeader>
      
      <ScrollArea className="flex-grow overflow-auto">
        <CardContent className="p-4 divide-y space-y-4">
          {/* Seção de informações gerais */}
          <div className="pb-4 grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
            <div className="flex items-center gap-3">
              <CalendarClock className="text-blue-500 w-5 h-5" />
              <div>
                <p className="text-sm font-semibold text-gray-700">Data da Visita</p>
                <p className="text-sm text-gray-600">
                  {format(visita.dataVisita, "PP 'às' p", { locale: ptBR })}
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <Timer className="text-blue-500 w-5 h-5" />
              <div>
                <p className="text-sm font-semibold text-gray-700">Duração</p>
                <p className="text-sm text-gray-600">{formatarTempoDecorrido(visita.tempoVisita)}</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <User className="text-blue-500 w-5 h-5" />
              <div>
                <p className="text-sm font-semibold text-gray-700">Agente</p>
                <p className="text-sm text-gray-600">{visita.nome_agente}</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <User className="text-blue-500 w-5 h-5" />
              <div>
                <p className="text-sm font-semibold text-gray-700">Supervisor</p>
                <p className="text-sm text-gray-600">{visita.supervisor}</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <Home className="text-blue-500 w-5 h-5" />
              <div>
                <p className="text-sm font-semibold text-gray-700">Tipo de Imóvel</p>
                <p className="text-sm text-gray-600">{getTipoImovelText(visita.tipo_imovel)}</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <ClipboardList className="text-blue-500 w-5 h-5" />
              <div>
                <p className="text-sm font-semibold text-gray-700">Situação</p>
                <p className="text-sm text-gray-600">{getSituacaoImovelText(visita.situacao_imovel)}</p>
              </div>
            </div>
          </div>
          
          {/* Seção de depósitos */}
          <div className="py-4">
            <h3 className="text-md font-medium mb-3 text-gray-800">Depósitos Encontrados</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <div className="bg-gray-50 p-3 rounded">
                <p className="text-xs text-gray-600">A1</p>
                <p className="text-lg font-semibold">{visita.depositos_A1}</p>
              </div>
              <div className="bg-gray-50 p-3 rounded">
                <p className="text-xs text-gray-600">A2</p>
                <p className="text-lg font-semibold">{visita.depositos_A2}</p>
              </div>
              <div className="bg-gray-50 p-3 rounded">
                <p className="text-xs text-gray-600">B</p>
                <p className="text-lg font-semibold">{visita.depositos_B}</p>
              </div>
              <div className="bg-gray-50 p-3 rounded">
                <p className="text-xs text-gray-600">C</p>
                <p className="text-lg font-semibold">{visita.depositos_C}</p>
              </div>
              <div className="bg-gray-50 p-3 rounded">
                <p className="text-xs text-gray-600">D1</p>
                <p className="text-lg font-semibold">{visita.depositos_D1}</p>
              </div>
              <div className="bg-gray-50 p-3 rounded">
                <p className="text-xs text-gray-600">D2</p>
                <p className="text-lg font-semibold">{visita.depositos_D2}</p>
              </div>
              <div className="bg-gray-50 p-3 rounded">
                <p className="text-xs text-gray-600">E</p>
                <p className="text-lg font-semibold">{visita.depositos_E}</p>
              </div>
              <div className="bg-gray-50 p-3 rounded bg-blue-50">
                <p className="text-xs text-blue-600">Total</p>
                <p className="text-lg font-semibold text-blue-700">{totalDepositos}</p>
              </div>
            </div>
          </div>
          
          {/* Seção de tratamento */}
          <div className="py-4">
            <h3 className="text-md font-medium mb-3 text-gray-800">Tratamento</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-gray-50 p-3 rounded">
                <p className="text-xs text-gray-600">Larvicida Utilizado</p>
                <p className="text-md font-semibold">{visita.larvicida_utilizado}</p>
              </div>
              <div className="bg-gray-50 p-3 rounded">
                <p className="text-xs text-gray-600">Adulticida Utilizado</p>
                <p className="text-md font-semibold">{visita.adulticida_utilizado}</p>
              </div>
              <div className="bg-gray-50 p-3 rounded">
                <p className="text-xs text-gray-600">Quantidade de Larvicida (g)</p>
                <p className="text-md font-semibold">{visita.quantidade_larvicida}</p>
              </div>
              <div className="bg-gray-50 p-3 rounded">
                <p className="text-xs text-gray-600">Depósitos Tratados</p>
                <p className="text-md font-semibold">{visita.depositos_tratados}</p>
              </div>
            </div>
          </div>
          
          {/* Seção de amostras */}
          <div className="py-4">
            <h3 className="text-md font-medium mb-3 text-gray-800">Amostras</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-gray-50 p-3 rounded">
                <p className="text-xs text-gray-600">Coleta de Amostras</p>
                <p className="text-md font-semibold">{visita.coleta_amostras}</p>
              </div>
              <div className="bg-gray-50 p-3 rounded">
                <p className="text-xs text-gray-600">Amostras Enviadas</p>
                <p className="text-md font-semibold">{visita.amostras_enviadas}</p>
              </div>
            </div>
          </div>
          
          {/* Pendências e observações */}
          {(visita.pendencia || visita.observacoes_gerais) && (
            <div className="py-4">
              <h3 className="text-md font-medium mb-3 text-gray-800">Observações e Pendências</h3>
              
              {visita.pendencia && (
                <div className="mb-4">
                  <div className="flex items-center gap-2 mb-1">
                    <AlertTriangle className="text-amber-500 w-4 h-4" />
                    <p className="text-sm font-semibold text-gray-700">Pendências</p>
                  </div>
                  <p className="text-sm text-gray-600 bg-amber-50 p-3 rounded">{visita.pendencia}</p>
                </div>
              )}
              
              {visita.observacoes_gerais && (
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <MessageSquare className="text-blue-500 w-4 h-4" />
                    <p className="text-sm font-semibold text-gray-700">Observações</p>
                  </div>
                  <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded">{visita.observacoes_gerais}</p>
                </div>
              )}
            </div>
          )}
          
          {/* Fotos e vídeos */}
          {temArquivos && (
            <div className="py-4">
              <h3 className="text-md font-medium mb-3 text-gray-800">Fotos e Vídeos</h3>
              
              {fotos.length > 0 && (
                <div className="mb-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Image className="text-blue-500 w-4 h-4" />
                    <p className="text-sm font-semibold text-gray-700">Fotos ({fotos.length})</p>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {fotos.map((foto, index) => (
                      <a 
                        key={`foto-${index}`}
                        href={foto.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="border border-gray-200 rounded overflow-hidden bg-white hover:shadow-md transition-shadow"
                      >
                        <img 
                          src={foto.url} 
                          alt={`Foto ${index + 1}`}
                          className="w-full h-32 object-cover"
                        />
                      </a>
                    ))}
                  </div>
                </div>
              )}
              
              {videos.length > 0 && (
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <FileVideo className="text-blue-500 w-4 h-4" />
                    <p className="text-sm font-semibold text-gray-700">Vídeos ({videos.length})</p>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {videos.map((video, index) => (
                      <div 
                        key={`video-${index}`}
                        className="border border-gray-200 rounded overflow-hidden bg-black"
                      >
                        <video 
                          src={video.url}
                          controls
                          className="w-full h-full"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </ScrollArea>
      
      <CardFooter className="border-t p-4 flex justify-end shrink-0">
        <Button 
          onClick={onFechar}
          className="bg-blue-500 hover:bg-blue-600"
        >
          Fechar
        </Button>
      </CardFooter>
    </Card>
  );
};

export default DetalhesVisita;
