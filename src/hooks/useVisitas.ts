
import { useState, useEffect } from "react";
import { DetalhesVisitaData } from "@/components/visita/DetalhesVisita";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

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

// Hook para gerenciar os dados das visitas
export const useVisitas = () => {
  const [visitas, setVisitas] = useState<DetalhesVisitaData[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const { toast } = useToast();
  
  // Carregar visitas do Supabase quando o componente montar
  useEffect(() => {
    const carregarVisitas = async () => {
      try {
        setIsLoading(true);
        const { data, error } = await supabase
          .from('visitas')
          .select('*')
          .order('data_visita', { ascending: false });
          
        if (error) {
          console.error("Erro ao buscar visitas:", error);
          toast({
            title: "Erro",
            description: "Não foi possível carregar as visitas do banco de dados.",
            variant: "destructive"
          });
          return;
        }
        
        // Converte os dados do formato do banco para o formato usado pela aplicação
        const visitasFormatadas = data.map((visita: any) => ({
          id: visita.id,
          casaId: visita.casa_id,
          endereco: visita.endereco,
          dataVisita: new Date(visita.data_visita),
          tempoVisita: visita.tempo_visita,
          nome_agente: visita.nome_agente,
          supervisor: visita.supervisor,
          tipo_imovel: visita.tipo_imovel,
          situacao_imovel: visita.situacao_imovel,
          depositos_A1: visita.depositos_a1,
          depositos_A2: visita.depositos_a2,
          depositos_B: visita.depositos_b,
          depositos_C: visita.depositos_c,
          depositos_D1: visita.depositos_d1,
          depositos_D2: visita.depositos_d2,
          depositos_E: visita.depositos_e,
          pendencia: visita.pendencia,
          larvicida_utilizado: visita.larvicida_utilizado,
          adulticida_utilizado: visita.adulticida_utilizado,
          quantidade_larvicida: visita.quantidade_larvicida,
          depositos_tratados: visita.depositos_tratados,
          coleta_amostras: visita.coleta_amostras,
          amostras_enviadas: visita.amostras_enviadas,
          observacoes_gerais: visita.observacoes_gerais,
          arquivos: visita.arquivos || []
        }));
        
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
    const channel = supabase
      .channel('public:visitas')
      .on('postgres_changes', 
        { 
          event: '*', 
          schema: 'public', 
          table: 'visitas' 
        }, 
        () => {
          // Recarregar as visitas quando houver qualquer alteração
          carregarVisitas();
        }
      )
      .subscribe();
    
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
      const novaVisitaParaDB = {
        casa_id: visitaData.casaId,
        endereco,
        data_visita: visitaData.dataVisita.toISOString(),
        tempo_visita: visitaData.tempoVisita,
        nome_agente: visitaData.nome_agente,
        supervisor: visitaData.supervisor,
        tipo_imovel: visitaData.tipo_imovel,
        situacao_imovel: visitaData.situacao_imovel,
        depositos_a1: visitaData.depositos_A1,
        depositos_a2: visitaData.depositos_A2,
        depositos_b: visitaData.depositos_B,
        depositos_c: visitaData.depositos_C,
        depositos_d1: visitaData.depositos_D1,
        depositos_d2: visitaData.depositos_D2,
        depositos_e: visitaData.depositos_E,
        pendencia: visitaData.pendencia || null,
        larvicida_utilizado: visitaData.larvicida_utilizado,
        adulticida_utilizado: visitaData.adulticida_utilizado,
        quantidade_larvicida: visitaData.quantidade_larvicida,
        depositos_tratados: visitaData.depositos_tratados,
        coleta_amostras: visitaData.coleta_amostras,
        amostras_enviadas: visitaData.amostras_enviadas,
        observacoes_gerais: visitaData.observacoes_gerais || null,
        arquivos: visitaData.arquivos || [] // Adicionando arquivos à visita
      };

      const { data, error } = await supabase
        .from('visitas')
        .insert([novaVisitaParaDB])
        .select()
        .single();
        
      if (error) {
        console.error("Erro ao adicionar visita:", error);
        toast({
          title: "Erro",
          description: "Não foi possível salvar a visita no banco de dados.",
          variant: "destructive"
        });
        return null;
      }
      
      // Converte os dados do formato do banco para o formato usado pela aplicação
      const novaVisita: DetalhesVisitaData = {
        id: data.id,
        casaId: data.casa_id,
        endereco: data.endereco,
        dataVisita: new Date(data.data_visita),
        tempoVisita: data.tempo_visita,
        nome_agente: data.nome_agente,
        supervisor: data.supervisor,
        tipo_imovel: data.tipo_imovel,
        situacao_imovel: data.situacao_imovel,
        depositos_A1: data.depositos_a1,
        depositos_A2: data.depositos_a2,
        depositos_B: data.depositos_b,
        depositos_C: data.depositos_c,
        depositos_D1: data.depositos_d1,
        depositos_D2: data.depositos_d2,
        depositos_E: data.depositos_e,
        pendencia: data.pendencia,
        larvicida_utilizado: data.larvicida_utilizado,
        adulticida_utilizado: data.adulticida_utilizado,
        quantidade_larvicida: data.quantidade_larvicida,
        depositos_tratados: data.depositos_tratados,
        coleta_amostras: data.coleta_amostras,
        amostras_enviadas: data.amostras_enviadas,
        observacoes_gerais: data.observacoes_gerais,
        arquivos: data.arquivos || []
      };

      // Atualiza o estado local para refletir a nova visita
      // Não é necessário, pois a assinatura em tempo real já vai atualizar
      // setVisitas(prev => [novaVisita, ...prev]);
      
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
