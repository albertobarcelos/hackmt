
import React from "react";
import { GoogleMap, Marker, InfoWindow } from "@react-google-maps/api";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

interface Casa {
  id: string;
  endereco: string;
  numero: string;
  referencia?: string;
  position: { lat: number; lng: number };
}

interface GoogleMapsViewerProps {
  isLoaded: boolean;
  mapCenter: { lat: number; lng: number };
  casasFiltradas: Casa[];
  selectedMarker: string | null;
  onMarkerClick: (casaId: string) => void;
  onInfoWindowClose: () => void;
  onMapLoad: (map: google.maps.Map) => void;
  onMapUnmount: () => void;
  abrirFormularioCasa: (casaId: string) => void;
}

const containerStyle = {
  width: '100%',
  height: '400px'
};

const GoogleMapsViewer: React.FC<GoogleMapsViewerProps> = ({
  isLoaded,
  mapCenter,
  casasFiltradas,
  selectedMarker,
  onMarkerClick,
  onInfoWindowClose,
  onMapLoad,
  onMapUnmount,
  abrirFormularioCasa,
}) => {
  if (!isLoaded) {
    return (
      <Card className="flex items-center justify-center h-[400px] mb-4">
        <p className="text-gray-500">Carregando mapa...</p>
      </Card>
    );
  }

  return (
    <Card className="overflow-hidden mb-4 shadow-lg">
      <CardContent className="p-0">
        <GoogleMap
          mapContainerStyle={containerStyle}
          center={mapCenter}
          zoom={15}
          onLoad={onMapLoad}
          onUnmount={onMapUnmount}
          options={{
            mapTypeControl: false,
            streetViewControl: false,
            fullscreenControl: true,
            zoomControl: true,
          }}
        >
          {casasFiltradas.map(casa => (
            <Marker
              key={casa.id}
              position={casa.position}
              onClick={() => onMarkerClick(casa.id)}
              title={casa.endereco}
            />
          ))}
          
          {selectedMarker && (
            <InfoWindow
              position={casasFiltradas.find(casa => casa.id === selectedMarker)?.position}
              onCloseClick={onInfoWindowClose}
            >
              <div className="p-2 max-w-[200px]">
                {(() => {
                  const casa = casasFiltradas.find(c => c.id === selectedMarker);
                  if (!casa) return null;
                  return (
                    <>
                      <h3 className="font-medium text-sm">{casa.endereco}, {casa.numero}</h3>
                      {casa.referencia && (
                        <p className="text-xs text-gray-600 mb-2">Ref: {casa.referencia}</p>
                      )}
                      <Button 
                        className="w-full mt-2 bg-green-500 hover:bg-green-600 text-xs py-1"
                        onClick={() => abrirFormularioCasa(casa.id)}
                      >
                        Visitar
                      </Button>
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

export default GoogleMapsViewer;
