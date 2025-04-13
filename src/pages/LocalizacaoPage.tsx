
import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Search, Map } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useNavigate } from "react-router-dom";

// Dados fictícios de bairros
const bairros = [
  { id: "1", nome: "Centro" },
  { id: "2", nome: "Santa Luzia" },
  { id: "3", nome: "Jardim São Paulo" },
  { id: "4", nome: "Vila Nova" },
  { id: "5", nome: "Santo Antônio" },
];

// Dados fictícios de casas por bairro
const casasPorBairro: Record<string, Array<{ id: string; endereco: string; numero: string; referencia?: string }>> = {
  "1": [
    { id: "101", endereco: "Rua Principal", numero: "123", referencia: "Próximo à praça" },
    { id: "102", endereco: "Avenida Central", numero: "456", referencia: "Em frente ao banco" },
    { id: "103", endereco: "Rua das Flores", numero: "789" },
  ],
  "2": [
    { id: "201", endereco: "Rua São José", numero: "234", referencia: "Casa amarela" },
    { id: "202", endereco: "Avenida Santa Maria", numero: "567" },
    { id: "203", endereco: "Rua do Comércio", numero: "890", referencia: "Próximo ao mercado" },
  ],
  "3": [
    { id: "301", endereco: "Avenida Paulista", numero: "345" },
    { id: "302", endereco: "Rua dos Ipês", numero: "678", referencia: "Casa com portão verde" },
    { id: "303", endereco: "Rua das Acácias", numero: "901" },
  ],
  "4": [
    { id: "401", endereco: "Rua Nova", numero: "111", referencia: "Esquina com farmácia" },
    { id: "402", endereco: "Avenida Principal", numero: "222" },
    { id: "403", endereco: "Rua das Palmeiras", numero: "333", referencia: "Casa com muro azul" },
  ],
  "5": [
    { id: "501", endereco: "Rua Santo Antônio", numero: "444" },
    { id: "502", endereco: "Avenida da Igreja", numero: "555", referencia: "Próximo à escola" },
    { id: "503", endereco: "Rua das Mangueiras", numero: "666" },
  ],
};

const LocalizacaoPage: React.FC = () => {
  const navigate = useNavigate();
  const [bairroSelecionado, setBairroSelecionado] = useState<string>("");
  const [casasFiltradas, setCasasFiltradas] = useState<Array<{ id: string; endereco: string; numero: string; referencia?: string }>>([]);
  const [termoBusca, setTermoBusca] = useState<string>("");

  // Ao selecionar um bairro, carregamos as casas correspondentes
  const handleBairroChange = (value: string) => {
    setBairroSelecionado(value);
    setCasasFiltradas(casasPorBairro[value] || []);
    setTermoBusca("");
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
    // navigate(`/formulario-casa/${casaId}`);
    alert(`Formulário para casa ID: ${casaId} será implementado em breve!`);
  };

  return (
    <div className="container mx-auto max-w-md p-4 bg-gradient-to-br from-blue-50 to-indigo-100 min-h-screen">
      <h1 className="text-2xl font-bold text-blue-900 mb-6 text-center">Localização de Visitas</h1>
      
      {/* Seleção de Bairro */}
      <Card className="mb-6">
        <CardContent className="pt-4">
          <div className="space-y-4">
            <label className="text-sm font-medium text-gray-700">Selecione um Bairro:</label>
            <Select value={bairroSelecionado} onValueChange={handleBairroChange}>
              <SelectTrigger>
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

      {/* Botão para alternar para visualização de mapa */}
      <div className="mb-4">
        <Button 
          className="w-full flex justify-center items-center gap-2"
          variant="outline"
          onClick={() => navigate('/localizacao-mapa')}
        >
          <Map size={16} />
          <span>Ver no mapa</span>
        </Button>
      </div>

      {/* Lista de Casas (aparece apenas quando um bairro é selecionado) */}
      {bairroSelecionado && (
        <div className="space-y-4">
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

          <h2 className="text-lg font-medium text-blue-800">
            Casas em {bairros.find(b => b.id === bairroSelecionado)?.nome}:
          </h2>

          {casasFiltradas.length > 0 ? (
            <div className="space-y-3">
              {casasFiltradas.map((casa) => (
                <Card key={casa.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-medium">{casa.endereco}, {casa.numero}</h3>
                        {casa.referencia && (
                          <p className="text-sm text-gray-600">Ref: {casa.referencia}</p>
                        )}
                      </div>
                      <Button 
                        className="ml-2 bg-green-500 hover:bg-green-600"
                        onClick={() => abrirFormularioCasa(casa.id)}
                      >
                        Visitar
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <p className="text-center text-gray-500 py-4">
              {termoBusca ? "Nenhuma casa encontrada com esse termo." : "Nenhuma casa cadastrada neste bairro."}
            </p>
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

export default LocalizacaoPage;
