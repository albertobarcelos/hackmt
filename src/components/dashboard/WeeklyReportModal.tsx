
import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { DateRange } from "react-day-picker";
import { Checkbox } from "@/components/ui/checkbox";
import { format } from "date-fns";
import { Download, Printer, Send } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface WeeklyReportModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  dateRange: DateRange;
}

const WeeklyReportModal: React.FC<WeeklyReportModalProps> = ({
  open,
  onOpenChange,
  dateRange,
}) => {
  const [formato, setFormato] = useState("pdf");
  const [incluirDetalhes, setIncluirDetalhes] = useState(true);
  const [incluirGraficos, setIncluirGraficos] = useState(true);
  const { toast } = useToast();
  
  const handleGenerateReport = () => {
    toast({
      title: "Relatório gerado",
      description: `O relatório semanal foi gerado no formato ${formato.toUpperCase()}.`,
    });
    onOpenChange(false);
  };
  
  const handleEmailReport = () => {
    toast({
      title: "Relatório enviado",
      description: "O relatório semanal foi enviado por e-mail.",
    });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Gerar Relatório Semanal</DialogTitle>
          <DialogDescription>
            Selecione as opções para gerar o relatório semanal consolidado.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <div className="text-sm font-medium text-right">Período:</div>
            <div className="col-span-3">
              {dateRange.from && dateRange.to ? (
                <div className="text-sm">
                  {format(dateRange.from, "dd/MM/yyyy")} até{" "}
                  {format(dateRange.to, "dd/MM/yyyy")}
                </div>
              ) : (
                <div className="text-sm text-muted-foreground">Nenhuma data selecionada</div>
              )}
            </div>
          </div>
          
          <div className="grid grid-cols-4 items-center gap-4">
            <div className="text-sm font-medium text-right">Formato:</div>
            <div className="col-span-3">
              <Select value={formato} onValueChange={setFormato}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Selecione o formato" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem value="pdf">PDF</SelectItem>
                    <SelectItem value="excel">Excel</SelectItem>
                    <SelectItem value="csv">CSV</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="grid grid-cols-4 items-center gap-4">
            <div className="text-sm font-medium text-right">Opções:</div>
            <div className="col-span-3 space-y-2">
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="detalhes" 
                  checked={incluirDetalhes}
                  onCheckedChange={(checked) => setIncluirDetalhes(!!checked)}
                />
                <label
                  htmlFor="detalhes"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  Incluir detalhes por agente
                </label>
              </div>
              
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="graficos" 
                  checked={incluirGraficos}
                  onCheckedChange={(checked) => setIncluirGraficos(!!checked)}
                />
                <label
                  htmlFor="graficos"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  Incluir gráficos e visualizações
                </label>
              </div>
            </div>
          </div>
        </div>
        
        <DialogFooter className="flex flex-col sm:flex-row sm:justify-between gap-2">
          <div className="flex gap-2 w-full sm:w-auto">
            <Button
              variant="outline"
              className="flex-1 sm:flex-initial gap-2"
              onClick={() => onOpenChange(false)}
            >
              Cancelar
            </Button>
          </div>
          <div className="flex gap-2 w-full sm:w-auto">
            <Button
              variant="outline"
              className="flex-1 sm:flex-initial gap-2"
              onClick={handleEmailReport}
            >
              <Send className="h-4 w-4" />
              Enviar por Email
            </Button>
            <Button
              variant="outline"
              className="flex-1 sm:flex-initial gap-2"
              onClick={() => window.print()}
            >
              <Printer className="h-4 w-4" />
              Imprimir
            </Button>
            <Button
              className="flex-1 sm:flex-initial gap-2"
              onClick={handleGenerateReport}
            >
              <Download className="h-4 w-4" />
              Gerar Relatório
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default WeeklyReportModal;
