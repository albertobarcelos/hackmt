
import React, { useState, useCallback } from "react";
import { Card } from "@/components/ui/card";
import BairroSelector from "@/components/localizacao/BairroSelector";
import CasaSearch from "@/components/localizacao/CasaSearch";
import ListaCasas from "@/components/localizacao/ListaCasas";
import { bairrosData, casasPorBairro } from "@/data/bairrosData";
import { useVisitas } from "@/hooks/useVisitas";
import { useNavigate } from "react-router-dom";
import { useJsApiLoader } from "@react-google-maps/api";
import { Map, Pin } from "lucide-react";
import MapaVisitas from "@/components/localizacao/MapaVisitas";

// API key do Google Maps (use a mesma que já está sendo usada no projeto)
const GOOGLE_MAPS_API_KEY = "AIzaSyCPjjf1neEDoOiRvpTABgqSY55PPP2eN1M";

const VisitasPage = () => {
  const navigate = useNavigate();
  const [bairroSelecionado, setBairroSelecionado] = useState<string>("");
  const [casasFiltradas, setCasasFiltradas] = useState<Array<{ id: string; endereco: string; numero: string; referencia?: string; position?: { lat: number; lng: number } }>>([]);
  const [termoBusca, setTermoBusca] = useState<string>("");
  const [modoVisualizacao, setModoVisualizacao] = useState<"lista" | "mapa">("lista");
  const { obterVisitasPorCasa } = useVisitas();
  
  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: GOOGLE_MAPS_API_KEY
  });

  // Ao selecionar um bairro, carregamos as casas correspondentes
  const handleBairroChange = (value: string) => {
    setBairroSelecionado(value);
    setCasasFiltradas(casasPorBairro[value] || []);
    setTermoBusca("");
    
    // Quando selecionar um bairro, mudamos automaticamente para a visualização de mapa
    setModoVisualizacao("mapa");
  };

  // Filtragem de casas por termo de busca
  const handleBuscaCasa = (e: React.ChangeEvent<HTMLInputElement>) => {
    const termo = e.target.value.toLowerCase();
    setTermoBusca(termo);
    
    if (!bairroSelecionado) return;
    
    if (termo === "") {
      setCasasFiltradas(casasPorBairro[bairroSelecionado] || []);
    } else {
      const filtradas = casasPorBairro[bairroSelecionado].filter(casa => 
        casa.endereco.toLowerCase().includes(termo) || 
        casa.numero.toLowerCase().includes(termo) ||
        (casa.referencia && casa.referencia.toLowerCase().includes(termo))
      );
      setCasasFiltradas(filtradas);
    }
  };

  // Alternar entre visualização de mapa e lista
  const alternarVisualizacao = () => {
    setModoVisualizacao(prevMode => prevMode === "lista" ? "mapa" : "lista");
  };

  // Navegação para o formulário da casa
  const abrirFormularioCasa = (casaId: string) => {
    const casa = casasFiltradas.find(c => c.id === casaId);
    if (casa) {
      const enderecoCompleto = `${casa.endereco}, ${casa.numero}${casa.referencia ? ` (${casa.referencia})` : ''}`;
      
      navigate(`/app-ace/visita/${casaId}`, { 
        state: { 
          endereco: enderecoCompleto,
          fromAppAce: true
        } 
      });
    }
  };

  // Navegação para histórico de visitas no app mobile
  const abrirHistoricoVisitas = (casaId: string) => {
    const casa = casasFiltradas.find(c => c.id === casaId);
    if (casa) {
      const enderecoCompleto = `${casa.endereco}, ${casa.numero}${casa.referencia ? ` (${casa.referencia})` : ''}`;
      
      // Redirecionamos para a página de histórico mobile específica da casa
      navigate(`/app-ace/historico`, { 
        state: { 
          casaId: casaId,
          endereco: enderecoCompleto
        } 
      });
    }
  };

  // Verifica se existe histórico de visitas para uma casa
  const temHistoricoVisitas = (casaId: string) => {
    const visitas = obterVisitasPorCasa(casaId);
    return visitas && visitas.length > 0;
  };

  return (
    <div className="p-4">
      <BairroSelector
        bairros={bairrosData}
        bairroSelecionado={bairroSelecionado}
        onBairroChange={handleBairroChange}
      />

      {bairroSelecionado && (
        <div className="space-y-4 mt-4">
          <CasaSearch 
            termoBusca={termoBusca}
            onSearchChange={handleBuscaCasa}
          />
          
          <div className="flex justify-between items-center">
            <h2 className="text-md font-medium text-blue-800">
              {modoVisualizacao === "lista" ? "Casas em " : "Mapa de "} 
              {bairrosData.find(b => b.id === bairroSelecionado)?.nome}
            </h2>
            
            <button 
              className="flex items-center justify-center gap-1.5 text-sm bg-primary text-white px-3 py-1.5 rounded-md hover:bg-primary/90 transition-colors"
              onClick={alternarVisualizacao}
            >
              {modoVisualizacao === "lista" ? (
                <>
                  <Map className="h-4 w-4" />
                  Ver Mapa
                </>
              ) : (
                <>
                  <Pin className="h-4 w-4" />
                  Ver Lista
                </>
              )}
            </button>
          </div>
          
          {modoVisualizacao === "lista" ? (
            casasFiltradas.length > 0 ? (
              <ListaCasas 
                casas={casasFiltradas}
                temHistoricoVisitas={temHistoricoVisitas}
                onAbrirFormulario={abrirFormularioCasa}
                onAbrirHistorico={abrirHistoricoVisitas}
              />
            ) : (
              <p className="text-center text-gray-500 py-4">
                {termoBusca ? "Nenhuma casa encontrada com esse termo." : "Nenhuma casa cadastrada neste bairro."}
              </p>
            )
          ) : (
            <MapaVisitas
              isLoaded={isLoaded}
              bairroSelecionado={bairroSelecionado}
              casas={casasFiltradas}
              onVisitar={abrirFormularioCasa}
              onVerHistorico={abrirHistoricoVisitas}
              temHistoricoVisitas={temHistoricoVisitas}
            />
          )}
        </div>
      )}

      {!bairroSelecionado && (
        <div className="text-center text-gray-500 p-8">
          Selecione um bairro para visualizar as residências disponíveis.
        </div>
      )}
    </div>
  );
};

export default VisitasPage;
