
import React, { useEffect, useRef, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const MapaCalorPage: React.FC = () => {
  const mapRef = useRef<HTMLDivElement>(null);
  const [googleMapsLoaded, setGoogleMapsLoaded] = useState(false);
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [heatmap, setHeatmap] = useState<google.maps.visualization.HeatmapLayer | null>(null);

  // Carregar Google Maps API
  useEffect(() => {
    // Verifica se o script do Google Maps já foi carregado
    if (!document.getElementById('google-maps-script')) {
      const googleMapsScript = document.createElement('script');
      googleMapsScript.id = 'google-maps-script';
      googleMapsScript.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyB41DRUbKWJHPxaFjMAwdrzWzbVKartNGg&libraries=visualization&callback=initMap`;
      googleMapsScript.async = true;
      googleMapsScript.defer = true;
      
      // Função de callback para quando o Google Maps for carregado
      window.initMap = () => {
        setGoogleMapsLoaded(true);
      };
      
      document.head.appendChild(googleMapsScript);
    } else if (window.google) {
      setGoogleMapsLoaded(true);
    }
    
    return () => {
      // Limpar a função de callback global quando o componente é desmontado
      delete window.initMap;
    };
  }, []);

  // Inicializar o mapa quando o Google Maps estiver carregado
  useEffect(() => {
    if (googleMapsLoaded && mapRef.current) {
      // Centro do mapa
      const center = new google.maps.LatLng(-23.550520, -46.633308); // São Paulo por padrão
      
      // Configurações do mapa
      const mapOptions = {
        zoom: 13,
        center,
        mapTypeId: google.maps.MapTypeId.ROADMAP,
        styles: [
          {
            featureType: "administrative",
            elementType: "labels.text.fill",
            stylers: [{ color: "#444444" }]
          },
          {
            featureType: "landscape",
            elementType: "all",
            stylers: [{ color: "#f2f2f2" }]
          }
        ]
      };
      
      // Criar o mapa
      const newMap = new google.maps.Map(mapRef.current, mapOptions);
      setMap(newMap);
      
      // Dados fictícios para o mapa de calor (pontos de visitas)
      const heatMapData = [
        { location: new google.maps.LatLng(-23.550520, -46.633308), weight: 10 },
        { location: new google.maps.LatLng(-23.553520, -46.639308), weight: 8 },
        { location: new google.maps.LatLng(-23.548520, -46.631308), weight: 5 },
        { location: new google.maps.LatLng(-23.546520, -46.635308), weight: 7 },
        { location: new google.maps.LatLng(-23.552520, -46.637308), weight: 3 },
        { location: new google.maps.LatLng(-23.554520, -46.632308), weight: 9 },
        { location: new google.maps.LatLng(-23.549520, -46.634308), weight: 6 },
        // Adicione mais pontos conforme necessário
      ];
      
      // Criar o mapa de calor
      const newHeatmap = new google.maps.visualization.HeatmapLayer({
        data: heatMapData,
        map: newMap,
        radius: 30
      });
      setHeatmap(newHeatmap);
    }
  }, [googleMapsLoaded]);

  return (
    <div className="container mx-auto py-6">
      <h1 className="text-3xl font-bold mb-6">Mapa de Calor</h1>
      
      <Card>
        <CardHeader>
          <CardTitle>Distribuição de Visitas Domiciliares</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-sm text-muted-foreground mb-4">
            Este mapa mostra a concentração de visitas domiciliares realizadas pelos agentes.
            As áreas em vermelho indicam maior concentração de visitas.
          </div>
          <div 
            ref={mapRef} 
            className="w-full h-[500px] rounded-md border border-border"
            style={{ backgroundColor: "#f7f7f7" }} 
          />
          <div className="mt-4 text-xs text-muted-foreground">
            Dados atualizados em: {new Date().toLocaleDateString()}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

// Definir o tipo global para a função de callback
declare global {
  interface Window {
    initMap: () => void;
  }
}

export default MapaCalorPage;
