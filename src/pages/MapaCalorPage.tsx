
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { bairros } from "@/data/bairrosData";
import useGoogleMaps from "@/hooks/useGoogleMaps";
import BairroSelectorButtons from "@/components/mapa-calor/BairroSelectorButtons";
import MapaCalor from "@/components/mapa-calor/MapaCalor";

const MapaCalorPage: React.FC = () => {
  const [bairroSelecionado, setBairroSelecionado] = useState<string | null>(null);
  const [mostrarMapa, setMostrarMapa] = useState(false);
  const { toast } = useToast();

  // Usar o hook de Google Maps
  const { 
    googleMapsLoaded, 
    isLoading, 
    mapMode, 
    setMapContainer, 
    alternarModoDeMapa 
  } = useGoogleMaps({ bairroSelecionado, mostrarMapa });
  
  // Função para focar em um bairro específico
  const focarNoBairro = (bairroId: string) => {
    const bairroSelecionado = bairros.find(b => b.id === bairroId);
    setBairroSelecionado(bairroId);
    setMostrarMapa(true);
    
    // Notificação de bairro selecionado
    toast({
      title: `Bairro ${bairroSelecionado?.nome}`,
      description: "Carregando áreas de risco nesta região",
    });
  };
  
  // Função para resetar o mapa para visão geral
  const resetarMapa = () => {
    setMostrarMapa(false);
    setBairroSelecionado(null);
  };

  // Obter o nome do bairro selecionado
  const bairroName = bairroSelecionado 
    ? bairros.find(b => b.id === bairroSelecionado)?.nome 
    : null;

  return (
    <div className="container mx-auto py-6">
      <h1 className="text-3xl font-bold mb-6">Mapa de Calor</h1>
      
      <Card className="mb-6">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">
            Selecione um Bairro
          </CardTitle>
        </CardHeader>
        <CardContent>
          <BairroSelectorButtons 
            bairros={bairros}
            bairroSelecionado={bairroSelecionado}
            onBairroSelect={focarNoBairro}
            onResetMapa={resetarMapa}
          />
          {bairroSelecionado && (
            <p className="text-sm text-muted-foreground mb-2">
              Mostrando áreas de {bairroName}. 
              As áreas destacadas em vermelho indicam locais com baixa frequência de visitas.
            </p>
          )}
        </CardContent>
      </Card>
      
      {mostrarMapa && bairroSelecionado ? (
        <Card>
          <CardHeader>
            <CardTitle>
              {bairroSelecionado 
                ? `Áreas Críticas em ${bairroName}`
                : "Áreas Críticas com Baixa Frequência de Visitas"
              }
            </CardTitle>
          </CardHeader>
          <CardContent>
            <MapaCalor
              bairroSelecionado={bairroSelecionado}
              bairroName={bairroName}
              isLoading={isLoading}
              mapMode={mapMode}
              alternarModoDeMapa={alternarModoDeMapa}
              googleMapsLoaded={googleMapsLoaded}
              onMapContainerRef={setMapContainer}
            />
          </CardContent>
        </Card>
      ) : (
        <Card className="text-center p-12">
          <MapaCalor
            bairroSelecionado={null}
            bairroName={null}
            isLoading={isLoading}
            mapMode={mapMode}
            alternarModoDeMapa={alternarModoDeMapa}
            googleMapsLoaded={googleMapsLoaded}
            onMapContainerRef={setMapContainer}
          />
        </Card>
      )}
    </div>
  );
};

export default MapaCalorPage;
