
import { DetalhesVisitaData } from "@/components/visita/DetalhesVisita";

// Tipo para os dados do formulário de visita
export interface VisitaFormData {
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
  nome_agente: string;
  supervisor: string;
  observacoes_gerais?: string;
  tempoVisita: number;
  dataVisita: Date;
  casaId: string;
  arquivos?: Array<{ url: string; tipo: 'foto' | 'video' }>;
}

// Interface para o retorno do hook useVisitas
export interface UseVisitasReturn {
  visitas: DetalhesVisitaData[];
  isLoading: boolean;
  adicionarVisita: (visitaData: VisitaFormData, endereco: string) => Promise<DetalhesVisitaData | null>;
  obterVisitasPorCasa: (casaId: string) => DetalhesVisitaData[];
  obterDetalhesVisita: (visitaId: string) => DetalhesVisitaData | undefined;
}
