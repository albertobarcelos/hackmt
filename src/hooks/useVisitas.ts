
import { useState, useEffect } from "react";
import { DetalhesVisitaData } from "@/components/visita/DetalhesVisita";

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
}

// Função auxiliar para gerar um ID único
const gerarId = (): string => {
  return Date.now().toString(36) + Math.random().toString(36).substring(2);
};

// Hook para gerenciar os dados das visitas
export const useVisitas = () => {
  const [visitas, setVisitas] = useState<DetalhesVisitaData[]>([]);
  
  // Carregar visitas do localStorage quando o componente montar
  useEffect(() => {
    const visitasSalvas = localStorage.getItem("visitas");
    if (visitasSalvas) {
      try {
        const parsedVisitas = JSON.parse(visitasSalvas);
        // Converter strings de data para objetos Date
        const visitasComDatas = parsedVisitas.map((v: any) => ({
          ...v,
          dataVisita: new Date(v.dataVisita)
        }));
        setVisitas(visitasComDatas);
      } catch (error) {
        console.error("Erro ao carregar as visitas do localStorage:", error);
      }
    }
  }, []);

  // Salvar as visitas no localStorage sempre que elas mudarem
  useEffect(() => {
    if (visitas.length > 0) {
      localStorage.setItem("visitas", JSON.stringify(visitas));
    }
  }, [visitas]);

  // Adicionar uma nova visita
  const adicionarVisita = (
    visitaData: VisitaFormData,
    endereco: string
  ) => {
    const novaVisita: DetalhesVisitaData = {
      id: gerarId(),
      endereco,
      ...visitaData
    };

    setVisitas(prev => [novaVisita, ...prev]);
    return novaVisita;
  };

  // Obter visitas para uma casa específica
  const obterVisitasPorCasa = (casaId: string) => {
    return visitas.filter(v => v.casaId === casaId);
  };

  // Obter detalhes de uma visita específica
  const obterDetalhesVisita = (visitaId: string) => {
    return visitas.find(v => v.id === visitaId);
  };

  return {
    visitas,
    adicionarVisita,
    obterVisitasPorCasa,
    obterDetalhesVisita
  };
};
