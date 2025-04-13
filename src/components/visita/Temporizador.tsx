
import React, { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Clock } from "lucide-react";

interface TemporizadorProps {
  onTempoAtualizado: (tempoEmSegundos: number) => void;
}

export const Temporizador: React.FC<TemporizadorProps> = ({ onTempoAtualizado }) => {
  const [tempoDecorrido, setTempoDecorrido] = useState(0);
  const [ativo, setAtivo] = useState(true);

  useEffect(() => {
    let intervalo: number | undefined;

    if (ativo) {
      intervalo = window.setInterval(() => {
        setTempoDecorrido(prev => {
          const novoTempo = prev + 1;
          onTempoAtualizado(novoTempo);
          return novoTempo;
        });
      }, 1000);
    }

    return () => {
      if (intervalo) clearInterval(intervalo);
    };
  }, [ativo, onTempoAtualizado]);

  const formatarTempo = (segundos: number): string => {
    const minutos = Math.floor(segundos / 60);
    const segundosRestantes = segundos % 60;
    return `${minutos.toString().padStart(2, '0')}:${segundosRestantes.toString().padStart(2, '0')}`;
  };

  return (
    <Card className="px-4 py-2 flex items-center justify-center bg-blue-50 border-0 shadow-none">
      <div className="flex items-center gap-2">
        <Clock className="h-5 w-5 text-blue-600" />
        <div className="text-lg font-medium text-blue-800">
          {formatarTempo(tempoDecorrido)}
        </div>
      </div>
    </Card>
  );
};
