import React, { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import FormularioVisita from "@/components/visita/FormularioVisita";
import HistoricoVisitas from "@/components/visita/HistoricoVisitas";
import DetalhesVisita from "@/components/visita/DetalhesVisita";
import { useVisitas } from "@/hooks/useVisitas";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { ArrowLeft } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

const VisitaPage: React.FC = () => {
  const { casaId } = useParams<{ casaId: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const { adicionarVisita, obterVisitasPorCasa, obterDetalhesVisita, isLoading } = useVisitas();
  
  const [endereco, setEndereco] = useState<string>("");
  const [visitaSelecionadaId, setVisitaSelecionadaId] = useState<string | null>(null);
  const [exibirHistorico, setExibirHistorico] = useState<boolean>(false);
  
  useEffect(() => {
    if (location.state) {
      if (location.state.endereco) {
        setEndereco(location.state.endereco);
      }
      if (location.state.exibirHistorico) {
        setExibirHistorico(true);
      }
    } else if (casaId) {
      setEndereco("Endereço não especificado");
    }
  }, [location.state, casaId]);
  
  const visitasCasa = casaId ? obterVisitasPorCasa(casaId) : [];
  
  const detalhesVisita = visitaSelecionadaId 
    ? obterDetalhesVisita(visitaSelecionadaId)
    : null;
  
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
    }
  };
  
  const handleCancelar = () => {
    navigate('/localizacao');
  };
  
  const handleVerDetalhes = (visitaId: string) => {
    setVisitaSelecionadaId(visitaId);
  };
  
  const fecharDetalhes = () => {
    setVisitaSelecionadaId(null);
  };
  
  const toggleExibicao = () => {
    setExibirHistorico(!exibirHistorico);
  };

  if (isLoading) {
    return (
      <div className="container mx-auto max-w-sm px-3 pt-4 pb-16">
        <div className="mb-4 flex items-center">
          <Skeleton className="h-8 w-20" />
          <Skeleton className="ml-auto h-8 w-24" />
        </div>
        <div className="space-y-4">
          <Skeleton className="h-6 w-48" />
          <div className="space-y-3">
            {Array(3).fill(0).map((_, i) => (
              <Skeleton key={i} className="h-20 w-full" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 pt-3 pb-16">
      <div className="container mx-auto max-w-sm px-3">
        <div className="mb-3 flex items-center">
          <Button 
            className="text-blue-600 hover:text-blue-800 flex items-center gap-1 p-0"
            onClick={handleCancelar}
            variant="link"
          >
            <ArrowLeft className="h-4 w-4" />
            Voltar
          </Button>
          
          {visitasCasa.length > 0 && (
            <Button
              className="ml-auto text-sm h-8"
              variant="outline"
              onClick={toggleExibicao}
            >
              {exibirHistorico ? "Novo Registro" : "Ver Histórico"}
            </Button>
          )}
        </div>
        
        {exibirHistorico ? (
          <div className="space-y-4">
            <h1 className="text-lg font-bold text-blue-900 mb-3">Histórico de Visitas</h1>
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
          </div>
        ) : (
          <FormularioVisita
            casaId={casaId || ""}
            endereco={endereco}
            onSalvar={handleSalvarVisita}
            onCancelar={handleCancelar}
          />
        )}
      </div>
      
      <Dialog open={!!detalhesVisita} onOpenChange={fecharDetalhes}>
        <DialogContent className="max-w-sm p-0 bg-transparent border-none shadow-none mx-auto">
          {detalhesVisita && <DetalhesVisita visita={detalhesVisita} onFechar={fecharDetalhes} />}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default VisitaPage;
