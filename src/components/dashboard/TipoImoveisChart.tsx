
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Legend,
  Tooltip,
} from "recharts";
import { DateRange } from "react-day-picker";

interface TipoImoveisChartProps {
  dateRange: DateRange;
}

const TipoImoveisChart: React.FC<TipoImoveisChartProps> = ({ dateRange }) => {
  // Em uma aplicação real, estes dados viriam da API/banco de dados
  const data = [
    { name: "Residencial (R)", value: 783, color: "#8884d8" },
    { name: "Comercial (C)", value: 245, color: "#82ca9d" },
    { name: "Terreno Baldio (T)", value: 86, color: "#ffc658" },
    { name: "Ponto Estratégico (P)", value: 42, color: "#ff8042" },
    { name: "Outro (O)", value: 87, color: "#0088fe" },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Tipos de Imóveis Visitados</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
                label={({ name, percent }) =>
                  `${name} ${(percent * 100).toFixed(0)}%`
                }
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                formatter={(value) => [`${value} imóveis`, "Quantidade"]}
              />
              <Legend
                layout="horizontal"
                verticalAlign="bottom"
                align="center"
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          <div className="bg-muted p-4 rounded-md">
            <h5 className="text-sm font-bold mb-2">Situação dos Imóveis</h5>
            <ul className="space-y-1 text-sm">
              <li className="flex justify-between">
                <span>Normal (N):</span> <span className="font-medium">842</span>
              </li>
              <li className="flex justify-between">
                <span>Fechado (F):</span> <span className="font-medium">143</span>
              </li>
              <li className="flex justify-between">
                <span>Recusado (R):</span> <span className="font-medium">32</span>
              </li>
              <li className="flex justify-between">
                <span>Pendente (P):</span> <span className="font-medium">12</span>
              </li>
            </ul>
          </div>
          
          <div className="bg-muted p-4 rounded-md">
            <h5 className="text-sm font-bold mb-2">Pendências por Bairro</h5>
            <ul className="space-y-1 text-sm">
              <li className="flex justify-between">
                <span>Centro:</span> <span className="font-medium">42</span>
              </li>
              <li className="flex justify-between">
                <span>Santa Luzia:</span> <span className="font-medium">35</span>
              </li>
              <li className="flex justify-between">
                <span>Jardim São Paulo:</span> <span className="font-medium">53</span>
              </li>
              <li className="flex justify-between">
                <span>Vila Nova:</span> <span className="font-medium">28</span>
              </li>
              <li className="flex justify-between">
                <span>Santo Antônio:</span> <span className="font-medium">29</span>
              </li>
            </ul>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default TipoImoveisChart;
