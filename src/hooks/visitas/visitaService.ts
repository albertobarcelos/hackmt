
import { supabase } from "@/integrations/supabase/client";
import { DetalhesVisitaData } from "@/components/visita/DetalhesVisita";
import { VisitaFormData } from "./types";

// Função para buscar visitas do Supabase
export const buscarVisitas = async () => {
  const { data, error } = await supabase
    .from('visitas')
    .select('*')
    .order('data_visita', { ascending: false });
    
  if (error) {
    throw error;
  }
  
  return data;
};

// Função para formatar os dados vindos do banco
export const formatarVisitasDoDb = (visitasDb: any[]): DetalhesVisitaData[] => {
  return visitasDb.map((visita) => ({
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
};

// Função para converter dados do formulário para o formato do banco
export const prepararVisitaParaDb = (visitaData: VisitaFormData, endereco: string) => {
  return {
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
    arquivos: visitaData.arquivos || []
  };
};

// Função para adicionar uma nova visita
export const adicionarVisitaAoDb = async (visitaData: VisitaFormData, endereco: string) => {
  const novaVisitaParaDB = prepararVisitaParaDb(visitaData, endereco);

  const { data, error } = await supabase
    .from('visitas')
    .insert([novaVisitaParaDB])
    .select()
    .single();
    
  if (error) {
    throw error;
  }
  
  return data;
};

// Função para configurar a assinatura em tempo real
export const configurarAssinaturaRealtime = (callback: () => void) => {
  const channel = supabase
    .channel('public:visitas')
    .on('postgres_changes', 
      { 
        event: '*', 
        schema: 'public', 
        table: 'visitas' 
      }, 
      () => callback()
    )
    .subscribe();
    
  return channel;
};
