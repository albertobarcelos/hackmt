
import { useState, useEffect, useRef, useCallback } from "react";
import { useToast } from "@/hooks/use-toast";
import { useVisitas } from "@/hooks/useVisitas";
import { bairros } from "@/data/bairrosData";

declare global {
  interface Window {
    initMap: () => void;
  }
}

interface UseGoogleMapsProps {
  bairroSelecionado: string | null;
  mostrarMapa: boolean;
}

const useGoogleMaps = ({ bairroSelecionado, mostrarMapa }: UseGoogleMapsProps) => {
  const mapRef = useRef<HTMLDivElement | null>(null);
  const [googleMapsLoaded, setGoogleMapsLoaded] = useState(false);
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [heatmap, setHeatmap] = useState<google.maps.visualization.HeatmapLayer | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [mapMode, setMapMode] = useState<"visitas" | "naoVisitadas">("naoVisitadas");
  const { toast } = useToast();
  const { visitas } = useVisitas();

  // Referência para o elemento do mapa
  const setMapContainer = useCallback((element: HTMLDivElement | null) => {
    mapRef.current = element;
  }, []);

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
      
      // Gerar áreas não visitadas ao redor do bairro selecionado
      // Usando coordenadas específicas para o bairro de Cáceres
      const areasNaoVisitadas = [
        { endereco: "Av. Brasil 450, " + bairroInfo.nome, lat: bairroInfo.center.lat - 0.001, lng: bairroInfo.center.lng - 0.001, frequencia: 0 },
        { endereco: "Rua das Flores 123, " + bairroInfo.nome, lat: bairroInfo.center.lat - 0.0005, lng: bairroInfo.center.lng - 0.002, frequencia: 0 },
        { endereco: "Alameda Santos 789, " + bairroInfo.nome, lat: bairroInfo.center.lat + 0.001, lng: bairroInfo.center.lng - 0.0005, frequencia: 0 },
        { endereco: "Rua Piratininga 345, " + bairroInfo.nome, lat: bairroInfo.center.lat - 0.0008, lng: bairroInfo.center.lng + 0.002, frequencia: 0 },
        { endereco: "Av. Paulista 100, " + bairroInfo.nome, lat: bairroInfo.center.lat + 0.001, lng: bairroInfo.center.lng + 0.001, frequencia: 0 },
        { endereco: "Rua Augusta 500, " + bairroInfo.nome, lat: bairroInfo.center.lat - 0.001, lng: bairroInfo.center.lng + 0.0015, frequencia: 0 },
        { endereco: "Rua Consolação 250, " + bairroInfo.nome, lat: bairroInfo.center.lat + 0.002, lng: bairroInfo.center.lng - 0.001, frequencia: 0 },
        { endereco: "Av. Rebouças 150, " + bairroInfo.nome, lat: bairroInfo.center.lat + 0.0005, lng: bairroInfo.center.lng - 0.003, frequencia: 0 },
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
        
        console.log("Inicializando mapa para o bairro:", bairroInfo.nome, "Coords:", bairroInfo.center);
        
        // Centro do mapa nas coordenadas do bairro selecionado
        const centerCoordinates = new google.maps.LatLng(
          bairroInfo.center.lat,
          bairroInfo.center.lng
        );
        
        // Configurações do mapa com zoom aumentado
        const mapOptions = {
          zoom: 17, // Zoom mais alto para focar melhor no bairro
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
        
        // Adicionar marcador para o centro do bairro
        new google.maps.Marker({
          position: centerCoordinates,
          map: newMap,
          title: `Centro de ${bairroInfo.nome}`,
          icon: {
            path: google.maps.SymbolPath.CIRCLE,
            fillColor: '#4285F4',
            fillOpacity: 0.8,
            strokeColor: '#4285F4',
            strokeWeight: 1,
            scale: 10
          }
        });
        
        // Dados para o mapa de calor - áreas não visitadas (prioridade)
        const naoVisitadasData = areasNaoVisitadas.map(area => ({
          location: new google.maps.LatLng(area.lat, area.lng),
          weight: 10 // Peso alto para destacar áreas não visitadas
        }));
        
        // Criar o mapa de calor das áreas não visitadas com cores quentes (vermelho/laranja)
        const newHeatmapNaoVisitadas = new google.maps.visualization.HeatmapLayer({
          data: naoVisitadasData,
          map: newMap,
          radius: 30, // Reduzido para focar melhor em áreas específicas
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
  };

  return {
    googleMapsLoaded,
    isLoading,
    mapMode,
    setMapContainer,
    alternarModoDeMapa,
  };
};

export default useGoogleMaps;
