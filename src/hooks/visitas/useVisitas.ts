
import { useState, useEffect } from "react";
import { DetalhesVisitaData } from "@/components/visita/DetalhesVisita";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { VisitaFormData, UseVisitasReturn } from "./types";
import { 
  buscarVisitas, 
  formatarVisitasDoDb, 
  adicionarVisitaAoDb,
  configurarAssinaturaRealtime
} from "./visitaService";

// Hook principal para gerenciar os dados das visitas
export const useVisitas = (): UseVisitasReturn => {
  const [visitas, setVisitas] = useState<DetalhesVisitaData[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const { toast } = useToast();
  
  // Carregar visitas do Supabase quando o componente montar
  useEffect(() => {
    const carregarVisitas = async () => {
      try {
        setIsLoading(true);
        const visitasDb = await buscarVisitas();
        const visitasFormatadas = formatarVisitasDoDb(visitasDb);
        setVisitas(visitasFormatadas);
      } catch (error) {
        console.error("Erro ao carregar as visitas:", error);
        toast({
          title: "Erro",
          description: "Ocorreu um erro ao carregar as visitas.",
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    carregarVisitas();
    
    // Configura assinatura em tempo real para atualizações
    const channel = configurarAssinaturaRealtime(carregarVisitas);
    
    return () => {
      // Limpar a assinatura quando o componente desmontar
      supabase.removeChannel(channel);
    };
  }, [toast]);

  // Adicionar uma nova visita
  const adicionarVisita = async (
    visitaData: VisitaFormData,
    endereco: string
  ) => {
    try {
      const novaVisitaDb = await adicionarVisitaAoDb(visitaData, endereco);
      
      // Converte os dados do formato do banco para o formato usado pela aplicação
      const novaVisita: DetalhesVisitaData = {
        id: novaVisitaDb.id,
        casaId: novaVisitaDb.casa_id,
        endereco: novaVisitaDb.endereco,
        dataVisita: new Date(novaVisitaDb.data_visita),
        tempoVisita: novaVisitaDb.tempo_visita,
        nome_agente: novaVisitaDb.nome_agente,
        supervisor: novaVisitaDb.supervisor,
        tipo_imovel: novaVisitaDb.tipo_imovel,
        situacao_imovel: novaVisitaDb.situacao_imovel,
        depositos_A1: novaVisitaDb.depositos_a1,
        depositos_A2: novaVisitaDb.depositos_a2,
        depositos_B: novaVisitaDb.depositos_b,
        depositos_C: novaVisitaDb.depositos_c,
        depositos_D1: novaVisitaDb.depositos_d1,
        depositos_D2: novaVisitaDb.depositos_d2,
        depositos_E: novaVisitaDb.depositos_e,
        pendencia: novaVisitaDb.pendencia,
        larvicida_utilizado: novaVisitaDb.larvicida_utilizado,
        adulticida_utilizado: novaVisitaDb.adulticida_utilizado,
        quantidade_larvicida: novaVisitaDb.quantidade_larvicida,
        depositos_tratados: novaVisitaDb.depositos_tratados,
        coleta_amostras: novaVisitaDb.coleta_amostras,
        amostras_enviadas: novaVisitaDb.amostras_enviadas,
        observacoes_gerais: novaVisitaDb.observacoes_gerais,
        // Aqui está o ajuste: verificar se arquivos existe e fornecer um valor padrão caso não exista
        arquivos: Array.isArray(novaVisitaDb.arquivos) 
          ? novaVisitaDb.arquivos 
          : []
      };
      
      return novaVisita;
    } catch (error) {
      console.error("Erro ao adicionar visita:", error);
      toast({
        title: "Erro",
        description: "Ocorreu um erro ao salvar a visita.",
        variant: "destructive"
      });
      return null;
    }
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
    isLoading,
    adicionarVisita,
    obterVisitasPorCasa,
    obterDetalhesVisita
  };
};
