
import React, { useState, useCallback } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { GoogleMap, Marker, InfoWindow } from "@react-google-maps/api";
import { Button } from "@/components/ui/button";
import { bairrosData } from "@/data/bairrosData";
import { Clock, ArrowRight } from "lucide-react";

interface MapaVisitasProps {
  isLoaded: boolean;
  bairroSelecionado: string;
  casas: Array<{
    id: string;
    endereco: string;
    numero: string;
    referencia?: string;
    position?: { lat: number; lng: number };
  }>;
  onVisitar: (casaId: string) => void;
  onVerHistorico: (casaId: string) => void;
  temHistoricoVisitas: (casaId: string) => boolean;
}

const MapaVisitas: React.FC<MapaVisitasProps> = ({
  isLoaded,
  bairroSelecionado,
  casas,
  onVisitar,
  onVerHistorico,
  temHistoricoVisitas
}) => {
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [selectedMarker, setSelectedMarker] = useState<string | null>(null);
  
  // Encontra o bairro selecionado para obter suas coordenadas
  const bairroInfo = bairrosData.find(b => b.id === bairroSelecionado);
  
  const mapCenter = bairroInfo ? bairroInfo.center : { lat: -16.07, lng: -57.68 }; // Centro padrão se não encontrar o bairro
  
  const onMapLoad = useCallback((map: google.maps.Map) => {
    setMap(map);
  }, []);

  const handleMarkerClick = (casaId: string) => {
    setSelectedMarker(casaId);
  };

  const closeInfoWindow = () => {
    setSelectedMarker(null);
  };

  if (!isLoaded) {
    return (
      <Card className="flex items-center justify-center h-[250px] mb-4">
        <p className="text-gray-500">Carregando mapa...</p>
      </Card>
    );
  }

  return (
    <Card className="overflow-hidden mb-4">
      <CardContent className="p-0">
        <GoogleMap
          mapContainerStyle={{
            width: '100%',
            height: '300px'
          }}
          center={mapCenter}
          zoom={17}
          onLoad={onMapLoad}
          options={{
            mapTypeControl: false,
            streetViewControl: false,
            fullscreenControl: true,
            zoomControl: true,
          }}
        >
          {/* Marcador para o centro do bairro */}
          <Marker
            position={mapCenter}
            icon={{
              path: google.maps.SymbolPath.CIRCLE,
              fillColor: '#4285F4',
              fillOpacity: 0.6,
              strokeColor: '#4285F4',
              strokeWeight: 1,
              scale: 8
            }}
            title={bairroInfo ? `Centro de ${bairroInfo.nome}` : "Centro"}
          />
          
          {/* Marcadores para cada casa */}
          {casas.map(casa => {
            if (!casa.position) return null;
            
            return (
              <Marker
                key={casa.id}
                position={casa.position}
                onClick={() => handleMarkerClick(casa.id)}
                icon={{
                  // Substituindo o SymbolPath.HOME (que não existe) por um símbolo de shape que represente uma casa
                  path: "M12 2L2 12h3v8h14v-8h3L12 2z M7 17v-5h10v5", // Path SVG simples de uma casa
                  fillColor: temHistoricoVisitas(casa.id) ? '#22c55e' : '#ea384c',
                  fillOpacity: 0.8,
                  strokeColor: temHistoricoVisitas(casa.id) ? '#15803d' : '#be123c',
                  strokeWeight: 1,
                  scale: 1.5,
                  anchor: new google.maps.Point(12, 17) // Âncora ajustada para o centro da base do ícone
                }}
              />
            );
          })}
          
          {/* Janela de informação para casa selecionada */}
          {selectedMarker && (
            <InfoWindow
              position={casas.find(casa => casa.id === selectedMarker)?.position}
              onCloseClick={closeInfoWindow}
            >
              <div className="p-2 max-w-[200px]">
                {(() => {
                  const casa = casas.find(c => c.id === selectedMarker);
                  if (!casa) return null;
                  return (
                    <>
                      <h3 className="font-medium text-sm mb-1">{casa.endereco}, {casa.numero}</h3>
                      {casa.referencia && (
                        <p className="text-xs text-gray-600 mb-2">Ref: {casa.referencia}</p>
                      )}
                      <div className="flex flex-col gap-1.5 mt-2">
                        <Button 
                          className="w-full bg-green-500 hover:bg-green-600 text-xs py-1"
                          onClick={() => onVisitar(casa.id)}
                        >
                          <ArrowRight className="h-3 w-3 mr-1" />
                          Visitar
                        </Button>
                        
                        {temHistoricoVisitas(casa.id) && (
                          <Button 
                            className="w-full bg-blue-500 hover:bg-blue-600 text-xs py-1"
                            onClick={() => onVerHistorico(casa.id)}
                          >
                            <Clock className="h-3 w-3 mr-1" />
                            Histórico
                          </Button>
                        )}
                      </div>
                    </>
                  );
                })()}
              </div>
            </InfoWindow>
          )}
        </GoogleMap>
      </CardContent>
    </Card>
  );
};

export default MapaVisitas;
