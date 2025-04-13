
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export interface Rota {
  id?: string;
  agente_id: string;
  rua: string;
  bairro: string;
}

export const useRotasAgentes = () => {
  const [rotas, setRotas] = useState<Rota[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const { toast } = useToast();
  
  // Carregar rotas do Supabase quando o hook iniciar
  useEffect(() => {
    carregarRotas();
    
    // Configurar assinatura em tempo real para atualizações
    const channel = supabase
      .channel('public:rotas_agentes')
      .on('postgres_changes', 
        { 
          event: '*', 
          schema: 'public', 
          table: 'rotas_agentes' 
        }, 
        () => {
          // Recarregar as rotas quando houver qualquer alteração
          carregarRotas();
        }
      )
      .subscribe();
    
    return () => {
      // Limpar a assinatura quando o componente desmontar
      supabase.removeChannel(channel);
    };
  }, []);

  const carregarRotas = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('rotas_agentes')
        .select('*');
        
      if (error) {
        console.error("Erro ao buscar rotas:", error);
        toast({
          title: "Erro",
          description: "Não foi possível carregar as rotas do banco de dados.",
          variant: "destructive"
        });
        return;
      }
      
      setRotas(data || []);
    } catch (error) {
      console.error("Erro ao carregar as rotas:", error);
      toast({
        title: "Erro",
        description: "Ocorreu um erro ao carregar as rotas.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Adicionar uma nova rota
  const adicionarRota = async (rota: Rota) => {
    try {
      const { data, error } = await supabase
        .from('rotas_agentes')
        .insert([rota])
        .select();
        
      if (error) {
        console.error("Erro ao adicionar rota:", error);
        toast({
          title: "Erro",
          description: error.message,
          variant: "destructive"
        });
        return null;
      }
      
      return data?.[0];
    } catch (error) {
      console.error("Erro ao adicionar rota:", error);
      toast({
        title: "Erro",
        description: "Ocorreu um erro ao salvar a rota.",
        variant: "destructive"
      });
      return null;
    }
  };

  // Remover uma rota
  const removerRota = async (agente_id: string, rua: string, bairro: string) => {
    try {
      const { error } = await supabase
        .from('rotas_agentes')
        .delete()
        .match({ agente_id, rua, bairro });
        
      if (error) {
        console.error("Erro ao remover rota:", error);
        toast({
          title: "Erro",
          description: "Não foi possível remover a rota do banco de dados.",
          variant: "destructive"
        });
        return false;
      }
      
      return true;
    } catch (error) {
      console.error("Erro ao remover rota:", error);
      toast({
        title: "Erro",
        description: "Ocorreu um erro ao remover a rota.",
        variant: "destructive"
      });
      return false;
    }
  };

  // Salvar múltiplas rotas para um agente
  const salvarRotasAgente = async (agente_id: string, novasRotas: { rua: string; bairro: string }[]) => {
    try {
      // Primeiro exclui todas as rotas existentes para este agente
      const { error: deleteError } = await supabase
        .from('rotas_agentes')
        .delete()
        .match({ agente_id });
        
      if (deleteError) {
        console.error("Erro ao limpar rotas existentes:", deleteError);
        toast({
          title: "Erro",
          description: "Não foi possível atualizar as rotas do agente.",
          variant: "destructive"
        });
        return false;
      }
      
      // Se não há novas rotas para adicionar, retorna aqui
      if (novasRotas.length === 0) {
        return true;
      }
      
      // Insere as novas rotas
      const rotasParaInserir = novasRotas.map(r => ({
        agente_id,
        rua: r.rua,
        bairro: r.bairro
      }));
      
      const { error: insertError } = await supabase
        .from('rotas_agentes')
        .insert(rotasParaInserir);
        
      if (insertError) {
        console.error("Erro ao inserir novas rotas:", insertError);
        toast({
          title: "Erro",
          description: "Não foi possível salvar as novas rotas do agente.",
          variant: "destructive"
        });
        return false;
      }
      
      return true;
    } catch (error) {
      console.error("Erro ao salvar rotas do agente:", error);
      toast({
        title: "Erro",
        description: "Ocorreu um erro ao salvar as rotas do agente.",
        variant: "destructive"
      });
      return false;
    }
  };

  // Obter rotas para um agente específico
  const obterRotasAgente = (agente_id: string) => {
    return rotas.filter(r => r.agente_id === agente_id);
  };

  return {
    rotas,
    isLoading,
    adicionarRota,
    removerRota,
    salvarRotasAgente,
    obterRotasAgente,
    carregarRotas
  };
};
