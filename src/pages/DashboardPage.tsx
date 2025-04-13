
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Droplet,
  Calendar,
  Filter,
  FlaskConical,
  Flag,
  Home,
  XCircle,
  Clock,
} from "lucide-react";
import { DatePickerWithRange } from "@/components/dashboard/DateRangeSelector";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import StatusSummary from "@/components/dashboard/StatusSummary";
import RankingBairros from "@/components/dashboard/RankingBairros";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import WeeklyReportModal from "@/components/dashboard/WeeklyReportModal";
import { DateRange } from "react-day-picker";
import VisitasTable from "@/components/dashboard/VisitasTable";

const DashboardPage: React.FC = () => {
  const [dateRange, setDateRange] = useState<DateRange>({
    from: new Date(new Date().setDate(new Date().getDate() - 7)),
    to: new Date(),
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedBairro, setSelectedBairro] = useState<string | null>(null);
  const { toast } = useToast();
  
  const handleExportClick = () => {
    toast({
      title: "Relatório exportado",
      description: "O relatório foi exportado com sucesso.",
    });
  };

  const handleGenerateWeeklyReport = () => {
    setIsModalOpen(true);
  };

  const handleDateRangeChange = (range: DateRange | undefined) => {
    if (range) {
      setDateRange(range);
    }
  };

  const handleBairroSelect = (bairroNome: string) => {
    setSelectedBairro(bairroNome);
  };

  const resetSelectedBairro = () => {
    setSelectedBairro(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold">Dashboard do Supervisor</h1>
          <p className="text-muted-foreground mt-1">
            Acompanhamento de visitas e índices de infestação
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3">
          <DatePickerWithRange date={dateRange} setDate={handleDateRangeChange} />
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              onClick={handleExportClick}
              className="gap-2"
            >
              <Filter className="h-4 w-4" />
              Exportar
            </Button>
            <Button 
              onClick={handleGenerateWeeklyReport}
              className="gap-2 bg-primary"
            >
              <Calendar className="h-4 w-4" /> 
              Gerar Relatório
            </Button>
          </div>
        </div>
      </div>

      {/* Cards com informações principais */}
      <StatusSummary dateRange={dateRange} />

      {/* Conteúdo principal */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Coluna da esquerda - Ranking por Bairro */}
        <Card className="md:col-span-1">
          <CardHeader>
            <CardTitle className="flex justify-between items-center">
              <span>Bairros</span>
              {selectedBairro && (
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={resetSelectedBairro}
                  className="text-xs text-muted-foreground"
                >
                  Voltar para todos
                </Button>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <RankingBairros 
              dateRange={dateRange} 
              onBairroSelect={handleBairroSelect}
              selectedBairro={selectedBairro}
            />
          </CardContent>
        </Card>

        {/* Coluna da direita - Visitas por Endereço */}
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>
              {selectedBairro 
                ? `Visitas no Bairro: ${selectedBairro}` 
                : "Todas as Visitas"}
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <VisitasTable 
              dateRange={dateRange} 
              bairro={selectedBairro} 
            />
          </CardContent>
        </Card>
      </div>
      
      <WeeklyReportModal 
        open={isModalOpen} 
        onOpenChange={setIsModalOpen} 
        dateRange={dateRange}
      />
    </div>
  );
};

export default DashboardPage;
