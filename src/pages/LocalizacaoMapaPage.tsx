
import React, { useState, useCallback, useEffect, useRef } from "react";
import { GoogleMap, useJsApiLoader, Marker, InfoWindow } from "@react-google-maps/api";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Map } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";

// Dados fictícios de bairros
const bairros = [
  { id: "1", nome: "Centro", center: { lat: -23.550520, lng: -46.633308 } },
  { id: "2", nome: "Santa Luzia", center: { lat: -23.555520, lng: -46.643308 } },
  { id: "3", nome: "Jardim São Paulo", center: { lat: -23.540520, lng: -46.623308 } },
  { id: "4", nome: "Vila Nova", center: { lat: -23.560520, lng: -46.613308 } },
  { id: "5", nome: "Santo Antônio", center: { lat: -23.545520, lng: -46.653308 } },
];

// Dados fictícios de casas por bairro com coordenadas geográficas
const casasPorBairro: Record<string, Array<{ 
  id: string; 
  endereco: string; 
  numero: string; 
  referencia?: string;
  position: { lat: number; lng: number };
}>> = {
  "1": [
    { id: "101", endereco: "Rua Principal", numero: "123", referencia: "Próximo à praça", position: { lat: -23.550520, lng: -46.634308 } },
    { id: "102", endereco: "Avenida Central", numero: "456", referencia: "Em frente ao banco", position: { lat: -23.551520, lng: -46.632308 } },
    { id: "103", endereco: "Rua das Flores", numero: "789", position: { lat: -23.549520, lng: -46.631308 } },
  ],
  "2": [
    { id: "201", endereco: "Rua São José", numero: "234", referencia: "Casa amarela", position: { lat: -23.554520, lng: -46.644308 } },
    { id: "202", endereco: "Avenida Santa Maria", numero: "567", position: { lat: -23.556520, lng: -46.642308 } },
    { id: "203", endereco: "Rua do Comércio", numero: "890", referencia: "Próximo ao mercado", position: { lat: -23.557520, lng: -46.641308 } },
  ],
  "3": [
    { id: "301", endereco: "Avenida Paulista", numero: "345", position: { lat: -23.539520, lng: -46.622308 } },
    { id: "302", endereco: "Rua dos Ipês", numero: "678", referencia: "Casa com portão verde", position: { lat: -23.541520, lng: -46.624308 } },
    { id: "303", endereco: "Rua das Acácias", numero: "901", position: { lat: -23.542520, lng: -46.625308 } },
  ],
  "4": [
    { id: "401", endereco: "Rua Nova", numero: "111", referencia: "Esquina com farmácia", position: { lat: -23.559520, lng: -46.614308 } },
    { id: "402", endereco: "Avenida Principal", numero: "222", position: { lat: -23.561520, lng: -46.612308 } },
    { id: "403", endereco: "Rua das Palmeiras", numero: "333", referencia: "Casa com muro azul", position: { lat: -23.562520, lng: -46.611308 } },
  ],
  "5": [
    { id: "501", endereco: "Rua Santo Antônio", numero: "444", position: { lat: -23.546520, lng: -46.654308 } },
    { id: "502", endereco: "Avenida da Igreja", numero: "555", referencia: "Próximo à escola", position: { lat: -23.544520, lng: -46.652308 } },
    { id: "503", endereco: "Rua das Mangueiras", numero: "666", position: { lat: -23.543520, lng: -46.651308 } },
  ],
};

// Você precisará obter uma chave de API do Google Maps
// Para fins de desenvolvimento, vamos usar um placeholder
const GOOGLE_MAPS_API_KEY = "SUA_CHAVE_API_AQUI";

const containerStyle = {
  width: '100%',
  height: '400px'
};

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

  // Ao selecionar um bairro, carregamos as casas correspondentes
  const handleBairroChange = (value: string) => {
    setBairroSelecionado(value);
    setCasasFiltradas(casasPorBairro[value] || []);
    setTermoBusca("");
    
    // Centralize o mapa no bairro selecionado
    const bairroSelecionadoObj = bairros.find(b => b.id === value);
    if (bairroSelecionadoObj && map) {
      setMapCenter(bairroSelecionadoObj.center);
      map.panTo(bairroSelecionadoObj.center);
      map.setZoom(16);
    }
  };

  // Filtragem de casas por termo de busca
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

  // Simulação de navegação para o formulário da casa
  const abrirFormularioCasa = (casaId: string) => {
    // Aqui você navegaria para o formulário da casa específica
    console.log(`Abrindo formulário para casa ID: ${casaId}`);
    toast({
      title: "Casa selecionada",
      description: `Formulário para casa ID: ${casaId} será aberto`
    });
    // navigate(`/formulario-casa/${casaId}`);
    alert(`Formulário para casa ID: ${casaId} será implementado em breve!`);
    setSelectedMarker(null); // Fechar o InfoWindow após selecionar
  };

  return (
    <div className="container mx-auto max-w-md p-4 bg-gradient-to-br from-blue-50 to-indigo-100 min-h-screen">
      <h1 className="text-2xl font-bold text-blue-900 mb-6 text-center">Mapa de Visitas</h1>
      
      {/* Seleção de Bairro */}
      <Card className="mb-6">
        <CardContent className="pt-4">
          <div className="space-y-4">
            <label className="text-sm font-medium text-gray-700">Selecione um Bairro:</label>
            <Select value={bairroSelecionado} onValueChange={handleBairroChange}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Escolha um bairro" />
              </SelectTrigger>
              <SelectContent>
                {bairros.map((bairro) => (
                  <SelectItem key={bairro.id} value={bairro.id}>
                    {bairro.nome}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Barra de pesquisa */}
      {bairroSelecionado && (
        <div className="mb-4">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
            <Input
              type="text"
              placeholder="Buscar por endereço ou referência..."
              className="pl-8"
              value={termoBusca}
              onChange={handleBuscaCasa}
            />
          </div>
        </div>
      )}

      {/* Componente do Mapa */}
      {isLoaded ? (
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
                  onClick={() => setSelectedMarker(casa.id)}
                  title={casa.endereco}
                />
              ))}
              
              {selectedMarker && (
                <InfoWindow
                  position={casasFiltradas.find(casa => casa.id === selectedMarker)?.position}
                  onCloseClick={() => setSelectedMarker(null)}
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
      ) : (
        <Card className="flex items-center justify-center h-[400px] mb-4">
          <p className="text-gray-500">Carregando mapa...</p>
        </Card>
      )}
      
      {/* Botão para alternar entre visualização de lista e mapa */}
      <div className="mt-4 flex justify-center">
        <Button
          className="flex items-center gap-2"
          variant="outline"
          onClick={() => navigate('/localizacao')}
        >
          <Search size={16} />
          <span>Ver em lista</span>
        </Button>
      </div>

      {!bairroSelecionado && (
        <div className="text-center text-gray-500 p-8 mt-4">
          Selecione um bairro para visualizar o mapa com as residências disponíveis.
        </div>
      )}
    </div>
  );
};

export default LocalizacaoMapaPage;
