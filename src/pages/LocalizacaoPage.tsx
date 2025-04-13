
import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { useVisitas } from "@/hooks/useVisitas";
import BairroSelector from "@/components/localizacao/BairroSelector";
import CasaSearch from "@/components/localizacao/CasaSearch";
import ListaCasas from "@/components/localizacao/ListaCasas";
import { bairrosData } from "@/data/bairrosData";
import MobileNavbar from "@/components/mobile/MobileNavbar";

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
  const { obterVisitasPorCasa } = useVisitas();

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
      const filtradas = casasPorBairro[bairroSelecionado].filter(casa => 
        casa.endereco.toLowerCase().includes(termo) || 
        casa.numero.toLowerCase().includes(termo) ||
        (casa.referencia && casa.referencia.toLowerCase().includes(termo))
      );
      setCasasFiltradas(filtradas);
    }
  };

  // Navegação para o formulário da casa
  const abrirFormularioCasa = (casaId: string) => {
    const casa = casasFiltradas.find(c => c.id === casaId);
    if (casa) {
      const enderecoCompleto = `${casa.endereco}, ${casa.numero}${casa.referencia ? ` (${casa.referencia})` : ''}`;
      
      navigate(`/visita/${casaId}`, { 
        state: { endereco: enderecoCompleto } 
      });
    }
  };

  // Navegação para histórico de visitas
  const abrirHistoricoVisitas = (casaId: string) => {
    const casa = casasFiltradas.find(c => c.id === casaId);
    if (casa) {
      const enderecoCompleto = `${casa.endereco}, ${casa.numero}${casa.referencia ? ` (${casa.referencia})` : ''}`;
      
      navigate(`/visita/${casaId}`, { 
        state: { 
          endereco: enderecoCompleto,
          exibirHistorico: true 
        } 
      });
    }
  };

  // Verifica se existe histórico de visitas para uma casa
  const temHistoricoVisitas = (casaId: string) => {
    const visitas = obterVisitasPorCasa(casaId);
    return visitas && visitas.length > 0;
  };

  return (
    <div className="bg-gradient-to-br from-blue-50 to-indigo-100 min-h-screen pb-20">
      <div className="max-w-sm mx-auto px-3 pt-3">
        <div className="py-2">
          <h1 className="text-xl font-bold text-blue-900 mb-4 text-center">Visitas</h1>
          
          <BairroSelector
            bairros={bairrosData}
            bairroSelecionado={bairroSelecionado}
            onBairroChange={handleBairroChange}
          />

          {bairroSelecionado && (
            <div className="space-y-3 mt-3">
              <CasaSearch 
                termoBusca={termoBusca}
                onSearchChange={handleBuscaCasa}
              />

              <h2 className="text-sm font-medium text-blue-800">
                Casas em {bairrosData.find(b => b.id === bairroSelecionado)?.nome}:
              </h2>

              {casasFiltradas.length > 0 ? (
                <ListaCasas 
                  casas={casasFiltradas}
                  temHistoricoVisitas={temHistoricoVisitas}
                  onAbrirFormulario={abrirFormularioCasa}
                  onAbrirHistorico={abrirHistoricoVisitas}
                />
              ) : (
                <p className="text-center text-gray-500 py-4">
                  {termoBusca ? "Nenhuma casa encontrada com esse termo." : "Nenhuma casa cadastrada neste bairro."}
                </p>
              )}
            </div>
          )}

          {!bairroSelecionado && (
            <div className="text-center text-gray-500 p-6">
              Selecione um bairro para visualizar as residências disponíveis.
            </div>
          )}
        </div>
      </div>
      
      {/* Menu de navegação inferior fixo */}
      <MobileNavbar currentPath="visitas" />
    </div>
  );
};

export default LocalizacaoPage;
