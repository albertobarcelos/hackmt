
import React, { useState, useCallback } from "react";
import { useJsApiLoader } from "@react-google-maps/api";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { bairros, casasPorBairro } from "@/data/bairrosData";

// Components
import BairroSelector from "@/components/localizacao/BairroSelector";
import CasaSearch from "@/components/localizacao/CasaSearch";
import GoogleMapsViewer from "@/components/localizacao/GoogleMapsViewer";
import VisualizacaoToggle from "@/components/localizacao/VisualizacaoToggle";

// Usando uma chave padrão para testes (normalmente isso deveria vir de uma variável de ambiente)
const GOOGLE_MAPS_API_KEY = "AIzaSyB41DRUbKWJHPxaFjMAwdrzWzbVKartNGg";

const LocalizacaoMapaPage: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [bairroSelecionado, setBairroSelecionado] = useState<string>("");
  const [casasFiltradas, setCasasFiltradas] = useState<Array<{ 
    id: string; 
    endereco: string; 
    numero: string; 
    referencia?: string;
    position: { lat: number; lng: number };
  }>>([]);
  const [termoBusca, setTermoBusca] = useState<string>("");
  const [selectedMarker, setSelectedMarker] = useState<string | null>(null);
  const [mapCenter, setMapCenter] = useState<{ lat: number; lng: number }>({ lat: -23.550520, lng: -46.633308 });
  const [map, setMap] = useState<google.maps.Map | null>(null);

  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: GOOGLE_MAPS_API_KEY
  });

  const onMapLoad = useCallback((map: google.maps.Map) => {
    setMap(map);
  }, []);

  const onMapUnmount = useCallback(() => {
    setMap(null);
  }, []);

  const handleBairroChange = (value: string) => {
    setBairroSelecionado(value);
    setCasasFiltradas(casasPorBairro[value] || []);
    setTermoBusca("");
    
    const bairroSelecionadoObj = bairros.find(b => b.id === value);
    if (bairroSelecionadoObj && map) {
      setMapCenter(bairroSelecionadoObj.center);
      map.panTo(bairroSelecionadoObj.center);
      map.setZoom(16);
    }
  };

  const handleBuscaCasa = (e: React.ChangeEvent<HTMLInputElement>) => {
    const termo = e.target.value.toLowerCase();
    setTermoBusca(termo);
    
    if (!bairroSelecionado) return;
    
    if (termo === "") {
      setCasasFiltradas(casasPorBairro[bairroSelecionado] || []);
    } else {
      const casasFiltradas = casasPorBairro[bairroSelecionado].filter(casa => 
        casa.endereco.toLowerCase().includes(termo) || 
        casa.numero.toLowerCase().includes(termo) ||
        (casa.referencia && casa.referencia.toLowerCase().includes(termo))
      );
      setCasasFiltradas(casasFiltradas);
    }
  };

  const abrirFormularioCasa = (casaId: string) => {
    const casa = casasFiltradas.find(c => c.id === casaId);
    if (casa) {
      const enderecoCompleto = `${casa.endereco}, ${casa.numero}${casa.referencia ? ` (${casa.referencia})` : ''}`;
      
      navigate(`/visita/${casaId}`, { 
        state: { endereco: enderecoCompleto } 
      });
    }
    
    setSelectedMarker(null);
  };

  const handleMarkerClick = (casaId: string) => {
    setSelectedMarker(casaId);
  };

  const handleInfoWindowClose = () => {
    setSelectedMarker(null);
  };

  return (
    <div className="container mx-auto max-w-md p-4 bg-gradient-to-br from-blue-50 to-indigo-100 min-h-screen">
      <h1 className="text-2xl font-bold text-blue-900 mb-6 text-center">Mapa de Visitas</h1>
      
      <BairroSelector 
        bairros={bairros} 
        bairroSelecionado={bairroSelecionado} 
        onBairroChange={handleBairroChange} 
      />

      {bairroSelecionado && (
        <CasaSearch 
          termoBusca={termoBusca} 
          onSearchChange={handleBuscaCasa} 
        />
      )}

      <GoogleMapsViewer
        isLoaded={isLoaded}
        mapCenter={mapCenter}
        casasFiltradas={casasFiltradas}
        selectedMarker={selectedMarker}
        onMarkerClick={handleMarkerClick}
        onInfoWindowClose={handleInfoWindowClose}
        onMapLoad={onMapLoad}
        onMapUnmount={onMapUnmount}
        abrirFormularioCasa={abrirFormularioCasa}
      />
      
      <VisualizacaoToggle />

      {!bairroSelecionado && (
        <div className="text-center text-gray-500 p-8 mt-4">
          Selecione um bairro para visualizar o mapa com as residências disponíveis.
        </div>
      )}
    </div>
  );
};

export default LocalizacaoMapaPage;
