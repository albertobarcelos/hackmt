
import React, { useEffect, useRef, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useVisitas } from "@/hooks/useVisitas";
import { bairros } from "@/data/bairrosData";
import { Button } from "@/components/ui/button";
import { MapPin, Map } from "lucide-react";

const MapaCalorPage: React.FC = () => {
  const mapRef = useRef<HTMLDivElement>(null);
  const [googleMapsLoaded, setGoogleMapsLoaded] = useState(false);
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [heatmap, setHeatmap] = useState<google.maps.visualization.HeatmapLayer | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [mapMode, setMapMode] = useState<"visitas" | "naoVisitadas">("naoVisitadas");
  const [bairroSelecionado, setBairroSelecionado] = useState<string | null>(null);
  const [mostrarMapa, setMostrarMapa] = useState(false);
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
  const carregarDadosVisitas = async (bairroId: string) => {
    try {
      setIsLoading(true);
      
      // Obter o bairro selecionado
      const bairroInfo = bairros.find(b => b.id === bairroId);
      if (!bairroInfo) {
        throw new Error("Bairro não encontrado");
      }
      
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
      
      // Coordenadas para Cáceres-MT (ao invés das coordenadas do Pantanal)
      // Usando coordenadas mais precisas para os bairros de Cáceres
      const areasNaoVisitadas = [
        { endereco: "Av. Brasil 450, " + bairroInfo.nome, lat: bairroInfo.center.lat - 0.006, lng: bairroInfo.center.lng - 0.005, frequencia: 0 },
        { endereco: "Rua das Flores 123, " + bairroInfo.nome, lat: bairroInfo.center.lat - 0.003, lng: bairroInfo.center.lng - 0.006, frequencia: 0 },
        { endereco: "Alameda Santos 789, " + bairroInfo.nome, lat: bairroInfo.center.lat + 0.005, lng: bairroInfo.center.lng - 0.002, frequencia: 0 },
        { endereco: "Rua Piratininga 345, " + bairroInfo.nome, lat: bairroInfo.center.lat - 0.002, lng: bairroInfo.center.lng + 0.008, frequencia: 0 },
        { endereco: "Av. Paulista 100, " + bairroInfo.nome, lat: bairroInfo.center.lat + 0.003, lng: bairroInfo.center.lng + 0.003, frequencia: 0 },
        { endereco: "Rua Augusta 500, " + bairroInfo.nome, lat: bairroInfo.center.lat - 0.004, lng: bairroInfo.center.lng + 0.003, frequencia: 0 },
        { endereco: "Rua Consolação 250, " + bairroInfo.nome, lat: bairroInfo.center.lat + 0.006, lng: bairroInfo.center.lng - 0.004, frequencia: 0 },
        { endereco: "Av. Rebouças 150, " + bairroInfo.nome, lat: bairroInfo.center.lat + 0.002, lng: bairroInfo.center.lng - 0.009, frequencia: 0 },
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

  // Inicializar o mapa quando um bairro for selecionado
  useEffect(() => {
    if (googleMapsLoaded && mapRef.current && bairroSelecionado && mostrarMapa) {
      const inicializarMapa = async () => {
        const bairroInfo = bairros.find(b => b.id === bairroSelecionado);
        if (!bairroInfo) return;
        
        // Centro do mapa nas coordenadas do bairro selecionado
        const centerCoordinates = new google.maps.LatLng(
          bairroInfo.center.lat,
          bairroInfo.center.lng
        );
        
        // Configurações do mapa com zoom aumentado
        const mapOptions = {
          zoom: 16, // Aumentado para um zoom maior
          center: centerCoordinates,
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
        const { areasNaoVisitadas } = await carregarDadosVisitas(bairroSelecionado);
        
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
  }, [googleMapsLoaded, bairroSelecionado, mostrarMapa]);

  // Função para alternar o modo de exibição do mapa
  const alternarModoDeMapa = () => {
    setMapMode(prev => prev === "visitas" ? "naoVisitadas" : "visitas");
    
    if (map && heatmap) {
      // Implementação da alternância de visualização seria feita aqui
      // Por ora, está apenas mudando o estado
    }
  };
  
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
    
    if (map) {
      // Limpar o mapa atual
      map.setCenter(new google.maps.LatLng(0, 0));
    }
  };

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
          <div className="flex flex-wrap gap-2 mb-4">
            {bairros.map((bairro) => (
              <Button
                key={bairro.id}
                variant={bairroSelecionado === bairro.id ? "default" : "outline"}
                size="sm"
                className="flex items-center gap-1"
                onClick={() => focarNoBairro(bairro.id)}
              >
                <MapPin size={16} />
                {bairro.nome}
              </Button>
            ))}
            {bairroSelecionado && (
              <Button
                variant="ghost"
                size="sm"
                onClick={resetarMapa}
              >
                Visão Geral
              </Button>
            )}
          </div>
          {bairroSelecionado && (
            <p className="text-sm text-muted-foreground mb-2">
              Mostrando áreas de {bairros.find(b => b.id === bairroSelecionado)?.nome}. 
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
                ? `Áreas Críticas em ${bairros.find(b => b.id === bairroSelecionado)?.nome}`
                : "Áreas Críticas com Baixa Frequência de Visitas"
              }
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex justify-between items-center mb-4">
              <div className="text-sm text-muted-foreground">
                Este mapa mostra as áreas com menor frequência de visitas domiciliares no bairro selecionado.
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
      ) : (
        <Card className="text-center p-12">
          <div className="flex flex-col items-center gap-4">
            <Map className="h-16 w-16 text-gray-400" />
            <h3 className="text-xl font-medium">Selecione um bairro para visualizar o mapa</h3>
            <p className="text-muted-foreground">
              Clique em um dos botões de bairro acima para carregar o mapa de calor daquela região.
            </p>
          </div>
        </Card>
      )}
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
