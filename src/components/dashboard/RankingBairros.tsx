
import React, { useState } from "react";
import { DateRange } from "react-day-picker";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

interface RankingBairrosProps {
  dateRange: DateRange;
  onBairroSelect: (bairroNome: string) => void;
  selectedBairro: string | null;
}

const RankingBairros: React.FC<RankingBairrosProps> = ({ 
  dateRange, 
  onBairroSelect,
  selectedBairro 
}) => {
  const [searchTerm, setSearchTerm] = useState("");

  // Em uma aplicação real, estes dados viriam da API/banco de dados
  const bairrosInfo = [
    { 
      nome: "Centro", 
      status: "alto", 
      indice: 5.6, 
      totalImoveis: 320,
      visitados: 287,
      naoVisitados: 33
    },
    { 
      nome: "Jardim São Paulo", 
      status: "alto", 
      indice: 6.1,
      totalImoveis: 245,
      visitados: 198,
      naoVisitados: 47
    },
    { 
      nome: "Santa Luzia", 
      status: "médio", 
      indice: 4.3,
      totalImoveis: 280,
      visitados: 253,
      naoVisitados: 27
    },
    { 
      nome: "Vila Nova", 
      status: "baixo", 
      indice: 3.3,
      totalImoveis: 210,
      visitados: 204,
      naoVisitados: 6
    },
    { 
      nome: "Santo Antônio", 
      status: "baixo", 
      indice: 2.7,
      totalImoveis: 188,
      visitados: 186,
      naoVisitados: 2
    },
  ].sort((a, b) => b.indice - a.indice);

  // Filtra os bairros pelo termo de busca
  const filteredBairros = bairrosInfo.filter(bairro => 
    bairro.nome.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getBairroStatusClass = (status: string) => {
    switch (status) {
      case "alto": return "bg-red-500";
      case "médio": return "bg-yellow-500";
      case "baixo": return "bg-green-500";
      default: return "bg-gray-500";
    }
  };

  return (
    <div>
      <div className="p-4 border-b">
        <div className="relative">
          <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
          <Input 
            placeholder="Buscar bairro..." 
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>
      <div className="divide-y max-h-[500px] overflow-auto">
        {filteredBairros.length > 0 ? (
          filteredBairros.map((bairro, index) => {
            const progressPercent = (bairro.visitados / bairro.totalImoveis) * 100;
            const isSelected = selectedBairro === bairro.nome;
            
            return (
              <div 
                key={index} 
                className={`p-4 hover:bg-gray-50 cursor-pointer ${isSelected ? 'bg-blue-50' : ''}`}
                onClick={() => onBairroSelect(bairro.nome)}
              >
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="font-medium text-sm">{bairro.nome}</h3>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge className={getBairroStatusClass(bairro.status)}>
                        {bairro.status === "alto"
                          ? "Alto risco"
                          : bairro.status === "médio"
                          ? "Médio risco"
                          : "Baixo risco"}
                      </Badge>
                      <span className="text-xs text-muted-foreground">
                        {bairro.indice}% infestação
                      </span>
                    </div>
                  </div>
                </div>
                
                <div className="mt-3">
                  <div className="flex justify-between text-xs mb-1">
                    <span>Imóveis visitados: {bairro.visitados}/{bairro.totalImoveis}</span>
                    <span>{Math.round(progressPercent)}%</span>
                  </div>
                  <Progress value={progressPercent} className="h-2" />
                  
                  <div className="mt-2 grid grid-cols-2 gap-2">
                    <div className="bg-blue-50 p-1 rounded text-xs text-center">
                      <span className="block font-medium text-blue-800">{bairro.visitados}</span>
                      <span className="text-blue-600">Visitados</span>
                    </div>
                    <div className="bg-red-50 p-1 rounded text-xs text-center">
                      <span className="block font-medium text-red-800">{bairro.naoVisitados}</span>
                      <span className="text-red-600">Pendentes</span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <div className="p-8 text-center text-gray-500">
            Nenhum bairro encontrado com esse termo.
          </div>
        )}
      </div>
    </div>
  );
};

export default RankingBairros;
