
import React, { useState, useEffect } from "react";
import { VisitaHistorico } from "@/components/visita/HistoricoVisitas";
import HistoricoVisitasMobile from "@/components/visita/HistoricoVisitasMobile";
import { useVisitas } from "@/hooks/useVisitas";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import DetalhesVisita from "@/components/visita/DetalhesVisita";
import { useLocation } from "react-router-dom";

const HistoricoPage = () => {
  const location = useLocation();
  const { visitas, isLoading, obterDetalhesVisita, obterVisitasPorCasa } = useVisitas();
  const [visitaDetalhesId, setVisitaDetalhesId] = useState<string | null>(null);
  
  const locationState = location.state as { casaId?: string; endereco?: string } | null;
  const casaId = locationState?.casaId;
  const enderecoCasa = locationState?.endereco;
  
  const visitasExibidas = casaId 
    ? obterVisitasPorCasa(casaId) || []
    : visitas;

  const visitasFormatadas: VisitaHistorico[] = visitasExibidas.map(visita => ({
    id: visita.id,
    casaId: visita.casaId,
    endereco: visita.endereco,
    dataVisita: new Date(visita.dataVisita),
    tempoVisita: visita.tempoVisita,
    nome_agente: visita.nome_agente,
    situacao_imovel: visita.situacao_imovel,
  }));

  const handleVerDetalhes = (visitaId: string) => {
    setVisitaDetalhesId(visitaId);
  };
  
  const fecharDetalhes = () => {
    setVisitaDetalhesId(null);
  };
  
  const detalhesVisita = visitaDetalhesId ? obterDetalhesVisita(visitaDetalhesId) : null;

  return (
    <div className="p-4">
      <h2 className="text-lg font-semibold mb-4 text-blue-800">
        {casaId 
          ? `Histórico: ${enderecoCasa || 'Endereço não disponível'}`
          : 'Histórico de Visitas'}
      </h2>
      
      {isLoading ? (
        <div className="flex justify-center items-center h-40">
          <p>Carregando histórico...</p>
        </div>
      ) : visitasFormatadas.length > 0 ? (
        <HistoricoVisitasMobile
          visitas={visitasFormatadas}
          onVerDetalhes={handleVerDetalhes}
        />
      ) : (
        <div className="text-gray-500 text-center p-6 bg-white rounded-md shadow-sm">
          <p>Nenhuma visita registrada.</p>
          <p className="text-xs mt-2">
            {casaId 
              ? 'Este imóvel ainda não possui visitas registradas.'
              : 'As visitas realizadas aparecerão aqui automaticamente.'}
          </p>
        </div>
      )}
      
      <Dialog open={!!visitaDetalhesId} onOpenChange={fecharDetalhes}>
        <DialogContent className="max-w-[360px] p-0 h-[85vh] overflow-hidden">
          {detalhesVisita && (
            <DetalhesVisita 
              visita={detalhesVisita} 
              onFechar={fecharDetalhes} 
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default HistoricoPage;
