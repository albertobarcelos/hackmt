
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DateRange } from "react-day-picker";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { Droplets, Syringe } from "lucide-react";

interface InsumosSummaryProps {
  dateRange: DateRange;
}

const InsumosSummary: React.FC<InsumosSummaryProps> = ({ dateRange }) => {
  // Em uma aplicação real, estes dados viriam da API/banco de dados
  const larvicidaData = [
    { name: "Seg", quantidade: 3.2 },
    { name: "Ter", quantidade: 4.5 },
    { name: "Qua", quantidade: 3.8 },
    { name: "Qui", quantidade: 5.1 },
    { name: "Sex", quantidade: 4.2 },
  ];

  const adulticidaData = [
    { name: "Seg", quantidade: 1.2 },
    { name: "Ter", quantidade: 2.3 },
    { name: "Qua", quantidade: 1.8 },
    { name: "Qui", quantidade: 2.1 },
    { name: "Sex", quantidade: 1.9 },
  ];

  const insumos = [
    {
      nome: "BTI (Larvicida Biológico)",
      total: "15.3 kg",
      estoque: "80%",
      acoes: 243,
      tipo: "larvicida",
    },
    {
      nome: "Diflubenzuron",
      total: "5.5 kg",
      estoque: "65%",
      acoes: 128,
      tipo: "larvicida",
    },
    {
      nome: "Pyriproxyfen",
      total: "2.1 kg",
      estoque: "40%",
      acoes: 76,
      tipo: "larvicida",
    },
    {
      nome: "Deltametrina",
      total: "3.8 L",
      estoque: "55%",
      acoes: 42,
      tipo: "adulticida",
    },
    {
      nome: "Malathion",
      total: "1.2 L",
      estoque: "30%",
      acoes: 23,
      tipo: "adulticida",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <Card className="md:col-span-2">
        <CardHeader>
          <CardTitle>Consumo de Insumos</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={[...larvicidaData, ...adulticidaData.map(item => ({...item, name: `${item.name}*`}))]}
                margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
              >
                <defs>
                  <linearGradient id="colorLarvicida" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#8884d8" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="colorAdulticida" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#82ca9d" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#82ca9d" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Area
                  type="monotone"
                  dataKey="quantidade"
                  name="Larvicida (kg)"
                  stroke="#8884d8"
                  fillOpacity={1}
                  fill="url(#colorLarvicida)"
                />
                <Area
                  type="monotone"
                  dataKey="quantidade"
                  name="Adulticida (L)"
                  stroke="#82ca9d"
                  fillOpacity={1}
                  fill="url(#colorAdulticida)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
          
          <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-4 flex flex-col items-center justify-center">
                <div className="text-3xl font-bold text-primary flex items-center">
                  <Droplets className="mr-2" size={24} />
                  23.4
                </div>
                <div className="text-xs text-muted-foreground text-center">
                  Kg de larvicida
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 flex flex-col items-center justify-center">
                <div className="text-3xl font-bold text-green-500 flex items-center">
                  <Syringe className="mr-2" size={24} />
                  5.2
                </div>
                <div className="text-xs text-muted-foreground text-center">
                  L de adulticida
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 flex flex-col items-center justify-center">
                <div className="text-3xl font-bold">447</div>
                <div className="text-xs text-muted-foreground text-center">
                  Ações de controle
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 flex flex-col items-center justify-center">
                <div className="text-3xl font-bold">683</div>
                <div className="text-xs text-muted-foreground text-center">
                  Depósitos tratados
                </div>
              </CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Estoque de Insumos</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {insumos.map((insumo, index) => (
              <div key={index} className="bg-muted p-3 rounded-md">
                <div className="flex justify-between items-center">
                  <div className="flex items-center space-x-2">
                    {insumo.tipo === "larvicida" ? (
                      <Droplets size={16} className="text-primary" />
                    ) : (
                      <Syringe size={16} className="text-green-500" />
                    )}
                    <span className="font-medium">{insumo.nome}</span>
                  </div>
                  <div className="text-sm">{insumo.total}</div>
                </div>
                
                <div className="mt-2 flex justify-between items-center">
                  <div className="w-full">
                    <div className="flex justify-between text-xs text-muted-foreground mb-1">
                      <span>{insumo.acoes} ações</span>
                      <span>Estoque: {insumo.estoque}</span>
                    </div>
                    <div className="w-full bg-background rounded-full h-2">
                      <div
                        className={`h-2 rounded-full ${
                          parseFloat(insumo.estoque) <= 40
                            ? "bg-red-500"
                            : parseFloat(insumo.estoque) <= 70
                            ? "bg-yellow-500"
                            : "bg-green-500"
                        }`}
                        style={{ width: insumo.estoque }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default InsumosSummary;
