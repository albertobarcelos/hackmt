
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, X, Save, MapPin } from "lucide-react";

export interface RotaItem {
  rua: string;
  bairro: string;
}

interface RotasAgenteProps {
  rotasSelecionadas: RotaItem[];
  onAdicionarRua: (rua: string, bairro: string) => void;
  onRemoverRua: (rua: string, bairro: string) => void;
  onSalvarRotas: () => void;
  ruasDisponiveis: RotaItem[];
  buscarRua: string;
  onBuscarRuaChange: (value: string) => void;
  modo: "editar" | "visualizar";
}

const RotasAgente: React.FC<RotasAgenteProps> = ({
  rotasSelecionadas,
  onAdicionarRua,
  onRemoverRua,
  onSalvarRotas,
  ruasDisponiveis,
  buscarRua,
  onBuscarRuaChange,
  modo
}) => {
  // Filtra as ruas disponíveis com base na busca
  const ruasFiltradas = ruasDisponiveis
    .filter(rota => 
      rota.rua.toLowerCase().includes(buscarRua.toLowerCase()) ||
      rota.bairro.toLowerCase().includes(buscarRua.toLowerCase())
    );

  return (
    <div className="space-y-4 py-4">
      {modo === "editar" && (
        <>
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Buscar rua ou bairro..."
              className="pl-8"
              value={buscarRua}
              onChange={(e) => onBuscarRuaChange(e.target.value)}
            />
          </div>
          
          <div className="border rounded-md p-2 h-40 overflow-auto">
            {ruasFiltradas.length > 0 ? (
              <ul className="space-y-1">
                {ruasFiltradas.map((rota, index) => (
                  <li key={index} className="flex justify-between items-center p-1 hover:bg-slate-50 rounded">
                    <div>
                      <span className="font-medium">{rota.rua}</span>
                      <span className="text-xs text-muted-foreground ml-2">
                        Bairro: {rota.bairro}
                      </span>
                    </div>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => onAdicionarRua(rota.rua, rota.bairro)}
                    >
                      <span className="sr-only">Adicionar</span>
                      <span>+</span>
                    </Button>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-center py-2 text-muted-foreground">
                {buscarRua ? "Nenhuma rua encontrada" : "Todas as ruas já foram selecionadas"}
              </p>
            )}
          </div>
        </>
      )}
      
      <div>
        <h4 className="text-sm font-medium mb-2">
          {modo === "editar" 
            ? `Ruas selecionadas (${rotasSelecionadas.length})`
            : "Ruas sob responsabilidade deste agente"
          }
        </h4>
        <div className="border rounded-md p-2 max-h-60 overflow-auto">
          {rotasSelecionadas.length > 0 ? (
            <ul className="space-y-1">
              {rotasSelecionadas.map((rota, index) => (
                <li key={index} className="flex justify-between items-center p-1 hover:bg-slate-50 rounded">
                  <div className="flex items-center gap-2">
                    <MapPin size={16} className="text-blue-500" />
                    <div>
                      <span className="font-medium">{rota.rua}</span>
                      <span className="text-xs text-muted-foreground block">
                        Bairro: {rota.bairro}
                      </span>
                    </div>
                  </div>
                  {modo === "editar" && (
                    <Button 
                      variant="ghost" 
                      size="sm"
                      className="text-red-500 hover:text-red-700 hover:bg-red-50"
                      onClick={() => onRemoverRua(rota.rua, rota.bairro)}
                    >
                      <X size={16} />
                      <span className="sr-only">Remover</span>
                    </Button>
                  )}
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-center py-2 text-muted-foreground">
              {modo === "editar" ? "Nenhuma rua selecionada" : "Este agente ainda não possui rotas definidas"}
            </p>
          )}
        </div>
      </div>
      
      {modo === "editar" && (
        <div className="flex justify-end mt-4">
          <Button 
            onClick={onSalvarRotas} 
            disabled={rotasSelecionadas.length === 0}
          >
            <Save size={16} className="mr-2" />
            Salvar Rotas
          </Button>
        </div>
      )}
    </div>
  );
};

export default RotasAgente;
