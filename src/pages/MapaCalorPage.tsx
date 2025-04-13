
import React, { useEffect, useRef, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useVisitas } from "@/hooks/useVisitas";

const MapaCalorPage: React.FC = () => {
  const mapRef = useRef<HTMLDivElement>(null);
  const [googleMapsLoaded, setGoogleMapsLoaded] = useState(false);
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [heatmap, setHeatmap] = useState<google.maps.visualization.HeatmapLayer | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [mapMode, setMapMode] = useState<"visitas" | "naoVisitadas">("naoVisitadas");
  const { toast } = useToast();
  const { visitas } = useVisitas();

  // Carregar Google Maps API
  useEffect(() => {
    // Verifica se o script do Google Maps já foi carregado
    if (!document.getElementById('google-maps-script')) {
      const googleMapsScript = document.createElement('script');
      googleMapsScript.id = 'google-maps-script';
      googleMapsScript.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyCPjjf1neEDoOiRvpTABgqSY55PPP2eN1M&libraries=visualization&callback=initMap`;
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

  // Dados de visitas domiciliares (locais com menos visitas)
  const carregarDadosVisitas = async () => {
    try {
      setIsLoading(true);
      
      // Locais visitados (endereços reais das visitas)
      const visitasRealizadas = visitas.map(visita => ({
        endereco: visita.endereco,
        dataVisita: visita.dataVisita,
        frequencia: 1 // Cada visita conta como 1 na frequência
      }));
      
      // Contabilizar a frequência de visitas por endereço
      const contadorVisitas = visitasRealizadas.reduce((contador, visita) => {
        contador[visita.endereco] = (contador[visita.endereco] || 0) + 1;
        return contador;
      }, {} as Record<string, number>);
      
      // Dados fictícios para áreas não visitadas (baixa frequência)
      const areasNaoVisitadas = [
        { endereco: "Av. Brasil 450, Pantanal", lat: -16.079, lng: -57.685, frequencia: 0 },
        { endereco: "Rua das Flores 123, Pantanal", lat: -16.073, lng: -57.674, frequencia: 0 },
        { endereco: "Alameda Santos 789, Pantanal", lat: -16.065, lng: -57.668, frequencia: 0 },
        { endereco: "Rua Piratininga 345, Pantanal", lat: -16.082, lng: -57.672, frequencia: 0 },
        { endereco: "Av. Paulista 100, Pantanal", lat: -16.077, lng: -57.680, frequencia: 0 },
        { endereco: "Rua Augusta 500, Pantanal", lat: -16.069, lng: -57.683, frequencia: 0 },
        { endereco: "Rua Consolação 250, Pantanal", lat: -16.063, lng: -57.676, frequencia: 0 },
        { endereco: "Av. Rebouças 150, Pantanal", lat: -16.068, lng: -57.671, frequencia: 0 },
      ];
      
      return {
        visitasRealizadas,
        areasNaoVisitadas,
        contadorVisitas
      };
    } catch (error) {
      console.error("Erro ao carregar dados de visitas:", error);
      toast({
        title: "Erro",
        description: "Não foi possível carregar os dados de visitas.",
        variant: "destructive"
      });
      return {
        visitasRealizadas: [],
        areasNaoVisitadas: [],
        contadorVisitas: {}
      };
    } finally {
      setIsLoading(false);
    }
  };

  // Inicializar o mapa quando o Google Maps estiver carregado
  useEffect(() => {
    if (googleMapsLoaded && mapRef.current) {
      const inicializarMapa = async () => {
        // Centro do mapa - corrigido o caractere invisível
        const center = new google.maps.LatLng(-16.0711, -57.6789); // Pantanal por padrão
        
        // Configurações do mapa com zoom aumentado
        const mapOptions = {
          zoom: 15, // Aumentado para um zoom maior
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
        
        // Buscar dados e criar o mapa de calor
        const { visitasRealizadas, areasNaoVisitadas } = await carregarDadosVisitas();
        
        // Dados para o mapa de calor - áreas não visitadas (prioridade)
        const naoVisitadasData = areasNaoVisitadas.map(area => ({
          location: new google.maps.LatLng(area.lat, area.lng),
          weight: 10 // Peso alto para destacar áreas não visitadas
        }));
        
        // Criar o mapa de calor das áreas não visitadas com cores quentes (vermelho/laranja)
        const newHeatmapNaoVisitadas = new google.maps.visualization.HeatmapLayer({
          data: naoVisitadasData,
          map: newMap,
          radius: 50,
          gradient: [
            'rgba(0, 0, 0, 0)',     // transparente no início
            'rgba(255, 165, 0, 0.6)', // laranja para áreas menos críticas
            'rgba(255, 140, 0, 0.7)', // laranja escuro
            'rgba(255, 69, 0, 0.8)',  // vermelho-laranja
            'rgba(255, 0, 0, 0.9)',   // vermelho
            'rgba(220, 0, 0, 1)',     // vermelho escuro para áreas mais críticas
            'rgba(185, 0, 0, 1)',     // vermelho muito escuro
            'rgba(165, 0, 0, 1)'      // vermelho intenso
          ],
          opacity: 0.8
        });
        
        // Adicionar marcadores para as áreas não visitadas
        areasNaoVisitadas.forEach(area => {
          const marker = new google.maps.Marker({
            position: { lat: area.lat, lng: area.lng },
            map: newMap,
            title: `${area.endereco} - Não visitado`,
            icon: {
              path: google.maps.SymbolPath.CIRCLE,
              fillColor: '#ea384c', // Vermelho mais intenso para pontos críticos
              fillOpacity: 0.8,
              strokeColor: '#ea384c',
              strokeWeight: 1,
              scale: 8
            }
          });
          
          const infoWindow = new google.maps.InfoWindow({
            content: `
              <div style="padding: 10px;">
                <h3 style="margin: 0 0 5px 0; font-size: 16px;">Área crítica</h3>
                <p style="margin: 0; font-size: 14px;">${area.endereco}</p>
                <p style="margin: 5px 0 0 0; color: #ea384c; font-size: 14px; font-weight: bold;">
                  Possível foco de dengue!
                </p>
              </div>
            `
          });
          
          marker.addListener('click', () => {
            infoWindow.open(newMap, marker);
          });
        });
        
        setHeatmap(newHeatmapNaoVisitadas);
      };
      
      inicializarMapa();
    }
  }, [googleMapsLoaded, toast]);

  const alternarModoDeMapa = () => {
    setMapMode(prev => prev === "visitas" ? "naoVisitadas" : "visitas");
    
    if (map && heatmap) {
      // Implementação da alternância de visualização seria feita aqui
      // Por ora, está apenas mudando o estado
    }
  };

  return (
    <div className="container mx-auto py-6">
      <h1 className="text-3xl font-bold mb-6">Mapa de Calor</h1>
      
      <Card>
        <CardHeader>
          <CardTitle>
            Áreas Críticas com Baixa Frequência de Visitas
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex justify-between items-center mb-4">
            <div className="text-sm text-muted-foreground">
              Este mapa mostra as áreas com menor frequência de visitas domiciliares.
              <span className="text-red-600 font-semibold"> As áreas em vermelho indicam locais raramente visitados</span>, 
              que podem ser focos potenciais de dengue por falta de inspeção regular.
            </div>
            
            <button 
              className={`px-4 py-2 rounded-md ${
                mapMode === "naoVisitadas" 
                ? "bg-red-500 text-white" 
                : "bg-gray-200 text-gray-700"
              }`}
              onClick={alternarModoDeMapa}
            >
              {mapMode === "naoVisitadas" 
                ? "Mostrando: Áreas críticas" 
                : "Mostrando: Visitas realizadas"}
            </button>
          </div>
          <div 
            ref={mapRef} 
            className={`w-full h-[500px] rounded-md border border-border ${isLoading ? "opacity-50" : ""}`}
            style={{ backgroundColor: "#f7f7f7" }} 
          />
          {isLoading && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500"></div>
            </div>
          )}
          <div className="mt-4 flex justify-between items-center">
            <div className="text-xs text-muted-foreground">
              Dados atualizados em: {new Date().toLocaleDateString()}
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center">
                <span className="inline-block w-3 h-3 bg-orange-400 rounded-full mr-1"></span>
                <span className="text-xs">Menor prioridade</span>
              </div>
              <div className="flex items-center">
                <span className="inline-block w-3 h-3 bg-red-600 rounded-full mr-1"></span>
                <span className="text-xs">Alta prioridade</span>
              </div>
            </div>
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
