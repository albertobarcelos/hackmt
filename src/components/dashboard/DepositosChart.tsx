
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { DateRange } from "react-day-picker";

interface DepositosChartProps {
  dateRange: DateRange;
}

const DepositosChart: React.FC<DepositosChartProps> = ({ dateRange }) => {
  // Em uma aplicação real, estes dados viriam da API/banco de dados
  const data = [
    { name: 'A1', tratados: 85, encontrados: 120 },
    { name: 'A2', tratados: 65, encontrados: 90 },
    { name: 'B', tratados: 110, encontrados: 140 },
    { name: 'C', tratados: 150, encontrados: 185 },
    { name: 'D1', tratados: 130, encontrados: 155 },
    { name: 'D2', tratados: 90, encontrados: 110 },
    { name: 'E', tratados: 53, encontrados: 70 },
  ];

  return (
    <Card className="col-span-2">
      <CardHeader>
        <CardTitle>Depósitos Encontrados vs Tratados</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[400px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart 
              data={data}
              margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip 
                formatter={(value, name) => {
                  return [`${value} depósitos`, name === "tratados" ? "Tratados" : "Encontrados"];
                }}
              />
              <Legend />
              <Bar dataKey="encontrados" name="Encontrados" fill="#8884d8" />
              <Bar dataKey="tratados" name="Tratados" fill="#82ca9d" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          <Card>
            <CardContent className="p-4">
              <div className="text-sm font-semibold">Tipo de Depósitos:</div>
              <ul className="mt-2 space-y-1 text-sm">
                <li><span className="font-medium">A1:</span> Depósito de água elevado</li>
                <li><span className="font-medium">A2:</span> Depósito de água ao nível do solo</li>
                <li><span className="font-medium">B:</span> Depósitos móveis</li>
                <li><span className="font-medium">C:</span> Depósitos fixos</li>
              </ul>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-sm font-semibold">Tipo de Depósitos:</div>
              <ul className="mt-2 space-y-1 text-sm">
                <li><span className="font-medium">D1:</span> Depósitos passíveis de remoção</li>
                <li><span className="font-medium">D2:</span> Depósitos passíveis de controle mecânico</li>
                <li><span className="font-medium">E:</span> Depósitos naturais</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </CardContent>
    </Card>
  );
};

export default DepositosChart;
