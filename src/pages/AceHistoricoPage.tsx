
import React from "react";
import { useVisitas } from "@/hooks/useVisitas";
import MobileNavbar from "@/components/mobile/MobileNavbar";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { ChevronRight, Clock, Home } from "lucide-react";

const AceHistoricoPage: React.FC = () => {
  const { visitas } = useVisitas();
  
  // Ordenar visitas por data (mais recente primeiro)
  const visitasOrdenadas = [...visitas].sort(
    (a, b) => new Date(b.dataVisita).getTime() - new Date(a.dataVisita).getTime()
  );

  return (
    <div className="bg-gradient-to-br from-blue-50 to-indigo-100 min-h-screen pb-20">
      <div className="max-w-sm mx-auto px-3 pt-3">
        <div className="py-2">
          <h1 className="text-xl font-bold text-blue-900 mb-4 text-center">Histórico de Visitas</h1>
          
          {visitasOrdenadas.length > 0 ? (
            <div className="space-y-3">
              {visitasOrdenadas.map((visita) => (
                <div 
                  key={visita.id} 
                  className="bg-white rounded-lg shadow p-3 flex justify-between items-center"
                >
                  <div className="flex-1">
                    <div className="flex items-center mb-1">
                      <Home size={14} className="text-blue-600 mr-1.5" />
                      <h3 className="font-medium text-gray-800 text-sm truncate max-w-[180px]">{visita.endereco}</h3>
                    </div>
                    <div className="flex items-center text-xs text-gray-500">
                      <Clock size={12} className="mr-1" />
                      {format(new Date(visita.dataVisita), "dd 'de' MMM, yyyy 'às' HH:mm", { locale: ptBR })}
                    </div>
                    <div className="mt-1 text-xs">
                      <span className={`px-2 py-0.5 rounded-full ${
                        visita.situacao_imovel === "T" ? "bg-green-100 text-green-800" : 
                        visita.situacao_imovel === "P" ? "bg-yellow-100 text-yellow-800" : 
                        "bg-blue-100 text-blue-800"
                      }`}>
                        {visita.situacao_imovel === "T" ? "Tratado" : 
                         visita.situacao_imovel === "P" ? "Pendente" : 
                         "Normal"}
                      </span>
                    </div>
                  </div>
                  <ChevronRight size={18} className="text-gray-400" />
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center text-gray-500 p-6">
              Nenhuma visita registrada.
            </div>
          )}
        </div>
      </div>
      
      {/* Menu de navegação inferior fixo */}
      <MobileNavbar currentPath="historico" />
    </div>
  );
};

export default AceHistoricoPage;
