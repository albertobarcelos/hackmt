
import React, { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import FormularioVisita from "@/components/visita/FormularioVisita";
import HistoricoVisitas from "@/components/visita/HistoricoVisitas";
import HistoricoVisitasMobile from "@/components/visita/HistoricoVisitasMobile";
import DetalhesVisita from "@/components/visita/DetalhesVisita";
import { useVisitas } from "@/hooks/useVisitas";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { ArrowLeft } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { useIsMobile } from "@/hooks/use-mobile";

const VisitaPage: React.FC = () => {
  const { casaId } = useParams<{ casaId: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const { adicionarVisita, obterVisitasPorCasa, obterDetalhesVisita, isLoading } = useVisitas();
  const isMobile = useIsMobile();
  
  // Determinar se estamos no contexto do app ACE ou no portal admin
  const isAppAce = location.pathname.includes('/app-ace') || location.state?.fromAppAce;
  
  const [endereco, setEndereco] = useState<string>("");
  const [visitaSelecionadaId, setVisitaSelecionadaId] = useState<string | null>(null);
  const [exibirHistorico, setExibirHistorico] = useState<boolean>(false);
  
  // Verificar se há dados da casa na location
  useEffect(() => {
    if (location.state) {
      if (location.state.endereco) {
        setEndereco(location.state.endereco);
      }
      if (location.state.exibirHistorico) {
        setExibirHistorico(true);
      }
    } else if (casaId) {
      // Aqui você poderia buscar os dados da casa usando o ID
      setEndereco("Endereço não especificado");
    }
  }, [location.state, casaId]);
  
  // Obter as visitas para esta casa
  const visitasCasa = casaId ? obterVisitasPorCasa(casaId) : [];
  
  // Detalhes da visita selecionada (se houver)
  const detalhesVisita = visitaSelecionadaId 
    ? obterDetalhesVisita(visitaSelecionadaId)
    : null;
  
  // Função para salvar os dados da visita
  const handleSalvarVisita = async (dados: any) => {
    if (!casaId) {
      toast({
        title: "Erro",
        description: "ID da casa não especificado.",
        variant: "destructive"
      });
      return;
    }
    
    const resultado = await adicionarVisita(dados, endereco);
    if (resultado) {
      setExibirHistorico(true);
      toast({
        title: "Sucesso",
        description: "Visita registrada com sucesso!",
        variant: "default"
      });
      
      // Correção da navegação após salvar
      if (isAppAce) {
        navigate('/app-ace');
      } else {
        navigate('/localizacao');
      }
    }
  };
  
  // Função para voltar à página anterior
  const handleCancelar = () => {
    if (isAppAce) {
      navigate('/app-ace');
    } else {
      navigate('/localizacao');
    }
  };
  
  // Exibir detalhes de uma visita
  const handleVerDetalhes = (visitaId: string) => {
    setVisitaSelecionadaId(visitaId);
  };
  
  // Fechar modal de detalhes
  const fecharDetalhes = () => {
    setVisitaSelecionadaId(null);
  };
  
  // Exibir o formulário ou o histórico de visitas
  const toggleExibicao = () => {
    setExibirHistorico(!exibirHistorico);
  };

  // Renderizando o esqueleto de carregamento
  if (isLoading) {
    return (
      <div className={`container mx-auto ${isAppAce ? 'max-w-[375px]' : 'max-w-4xl'} px-4 pt-4 pb-16`}>
        <div className="mb-6 flex items-center">
          <Skeleton className="h-10 w-24" />
          <Skeleton className="ml-auto h-10 w-32" />
        </div>
        <div className="space-y-6">
          <Skeleton className="h-8 w-64" />
          <div className="space-y-4">
            {Array(3).fill(0).map((_, i) => (
              <Skeleton key={i} className="h-24 w-full" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 pt-4 pb-16 ${isAppAce ? 'pb-24' : ''}`}>
      <div className={`container mx-auto ${isAppAce ? 'max-w-[375px]' : 'max-w-4xl'} px-4`}>
        <div className="mb-4 flex items-center">
          <Button 
            className="text-blue-600 hover:text-blue-800 flex items-center gap-1 p-0"
            onClick={handleCancelar}
            variant="link"
          >
            <ArrowLeft className="h-4 w-4" />
            {isAppAce ? 'Voltar' : 'Voltar para Localização'}
          </Button>
          
          {visitasCasa.length > 0 && (
            <Button
              className="ml-auto"
              variant="outline"
              onClick={toggleExibicao}
            >
              {exibirHistorico ? "Novo Registro" : "Ver Histórico"}
            </Button>
          )}
        </div>
        
        {exibirHistorico ? (
          <div className="space-y-6">
            <h1 className="text-2xl font-bold text-blue-900 mb-4">Histórico de Visitas</h1>
            {isAppAce ? (
              <HistoricoVisitasMobile
                visitas={visitasCasa.map(v => ({
                  id: v.id,
                  casaId: v.casaId,
                  endereco: v.endereco,
                  dataVisita: v.dataVisita,
                  tempoVisita: v.tempoVisita,
                  nome_agente: v.nome_agente,
                  situacao_imovel: v.situacao_imovel
                }))}
                onVerDetalhes={handleVerDetalhes}
              />
            ) : (
              <HistoricoVisitas
                visitas={visitasCasa.map(v => ({
                  id: v.id,
                  casaId: v.casaId,
                  endereco: v.endereco,
                  dataVisita: v.dataVisita,
                  tempoVisita: v.tempoVisita,
                  nome_agente: v.nome_agente,
                  situacao_imovel: v.situacao_imovel
                }))}
                onVerDetalhes={handleVerDetalhes}
              />
            )}
          </div>
        ) : (
          <FormularioVisita
            casaId={casaId || ""}
            endereco={endereco}
            onSalvar={handleSalvarVisita}
            onCancelar={handleCancelar}
            isMobile={isAppAce}
          />
        )}
      </div>
      
      {/* Dialog para exibir detalhes da visita - adicionando suporte a scroll */}
      <Dialog open={!!detalhesVisita} onOpenChange={fecharDetalhes}>
        <DialogContent 
          className={`${isAppAce ? 'max-w-[360px]' : 'max-w-3xl'} p-0 ${isAppAce ? '' : 'bg-transparent border-none shadow-none'} h-[85vh] overflow-hidden`}
        >
          {detalhesVisita && (
            <>
              <DialogTitle className="sr-only">Detalhes da Visita</DialogTitle>
              <DetalhesVisita visita={detalhesVisita} onFechar={fecharDetalhes} />
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default VisitaPage;
