
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Droplet,
  Home,
  Building,
  Users,
  Calendar,
  Filter,
  Syringe,
  FlaskConical,
  Truck,
  Flag,
} from "lucide-react";
import { DatePickerWithRange } from "@/components/dashboard/DateRangeSelector";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import StatusSummary from "@/components/dashboard/StatusSummary";
import DepositosChart from "@/components/dashboard/DepositosChart";
import TipoImoveisChart from "@/components/dashboard/TipoImoveisChart";
import AgentesPerformance from "@/components/dashboard/AgentesPerformance";
import LaboratorioSummary from "@/components/dashboard/LaboratorioSummary";
import RankingBairros from "@/components/dashboard/RankingBairros";
import InsumosSummary from "@/components/dashboard/InsumosSummary";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import WeeklyReportModal from "@/components/dashboard/WeeklyReportModal";
import { DateRange } from "react-day-picker";

const DashboardPage: React.FC = () => {
  const [dateRange, setDateRange] = useState<DateRange>({
    from: new Date(new Date().setDate(new Date().getDate() - 7)),
    to: new Date(),
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { toast } = useToast();
  
  const handleExportClick = () => {
    toast({
      title: "Relatório exportado",
      description: "O relatório semanal foi exportado com sucesso.",
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

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold">Dashboard do Supervisor</h1>
          <p className="text-muted-foreground mt-1">
            Acompanhamento e consolidação dos dados de campo
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
              Gerar Relatório Semanal
            </Button>
          </div>
        </div>
      </div>

      <StatusSummary dateRange={dateRange} />

      <Tabs defaultValue="resumo" className="w-full">
        <TabsList className="grid grid-cols-4 md:w-auto md:grid-cols-4">
          <TabsTrigger value="resumo">Resumo</TabsTrigger>
          <TabsTrigger value="depositos">Depósitos</TabsTrigger>
          <TabsTrigger value="agentes">Agentes</TabsTrigger>
          <TabsTrigger value="laboratorio">Laboratório</TabsTrigger>
        </TabsList>

        <TabsContent value="resumo" className="space-y-6 mt-6">
          <div className="grid gap-6 md:grid-cols-2">
            <TipoImoveisChart dateRange={dateRange} />
            <RankingBairros dateRange={dateRange} />
          </div>
          <InsumosSummary dateRange={dateRange} />
        </TabsContent>
        
        <TabsContent value="depositos" className="mt-6">
          <DepositosChart dateRange={dateRange} />
        </TabsContent>
        
        <TabsContent value="agentes" className="mt-6">
          <AgentesPerformance dateRange={dateRange} />
        </TabsContent>
        
        <TabsContent value="laboratorio" className="mt-6">
          <LaboratorioSummary dateRange={dateRange} />
        </TabsContent>
      </Tabs>
      
      <WeeklyReportModal 
        open={isModalOpen} 
        onOpenChange={setIsModalOpen} 
        dateRange={dateRange}
      />
    </div>
  );
};

export default DashboardPage;
