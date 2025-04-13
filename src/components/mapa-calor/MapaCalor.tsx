
import React, { useEffect, useRef, useState } from "react";
import { Map } from "lucide-react";

interface MapaCalorProps {
  bairroSelecionado: string | null;
  bairroName: string | null;
  isLoading: boolean;
  mapMode: "visitas" | "naoVisitadas";
  alternarModoDeMapa: () => void;
  googleMapsLoaded: boolean;
  onMapContainerRef: (ref: HTMLDivElement | null) => void;
}

const MapaCalor: React.FC<MapaCalorProps> = ({
  bairroSelecionado,
  bairroName,
  isLoading,
  mapMode,
  alternarModoDeMapa,
  googleMapsLoaded,
  onMapContainerRef,
}) => {
  if (!bairroSelecionado) {
    return (
      <div className="text-center p-12">
        <div className="flex flex-col items-center gap-4">
          <Map className="h-16 w-16 text-gray-400" />
          <h3 className="text-xl font-medium">Selecione um bairro para visualizar o mapa</h3>
          <p className="text-muted-foreground">
            Clique em um dos botões de bairro acima para carregar o mapa de calor daquela região.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div>
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
        ref={onMapContainerRef} 
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
    </div>
  );
};

export default MapaCalor;
