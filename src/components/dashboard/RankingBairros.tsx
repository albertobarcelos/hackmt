
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DateRange } from "react-day-picker";
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
import { Badge } from "@/components/ui/badge";

interface RankingBairrosProps {
  dateRange: DateRange;
}

const RankingBairros: React.FC<RankingBairrosProps> = ({ dateRange }) => {
  // Em uma aplicação real, estes dados viriam da API/banco de dados
  const data = [
    {
      name: "Centro",
      imoveis: 320,
      positivos: 18,
    },
    {
      name: "Santa Luzia",
      imoveis: 280,
      positivos: 12,
    },
    {
      name: "Jardim São Paulo",
      imoveis: 245,
      positivos: 15,
    },
    {
      name: "Vila Nova",
      imoveis: 210,
      positivos: 7,
    },
    {
      name: "Santo Antônio",
      imoveis: 188,
      positivos: 5,
    },
  ];

  const bairrosInfo = [
    { nome: "Centro", status: "alto", indice: 5.6 },
    { nome: "Jardim São Paulo", status: "alto", indice: 6.1 },
    { nome: "Santa Luzia", status: "médio", indice: 4.3 },
    { nome: "Vila Nova", status: "baixo", indice: 3.3 },
    { nome: "Santo Antônio", status: "baixo", indice: 2.7 },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Ranking por Bairro</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={data}
              margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
              barSize={20}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis yAxisId="left" orientation="left" />
              <YAxis yAxisId="right" orientation="right" />
              <Tooltip />
              <Legend />
              <Bar
                yAxisId="left"
                dataKey="imoveis"
                name="Imóveis Visitados"
                fill="#8884d8"
              />
              <Bar
                yAxisId="right"
                dataKey="positivos"
                name="Focos Positivos"
                fill="#ff8042"
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
        
        <div className="mt-4">
          <h5 className="text-sm font-semibold mb-2">Índice de Infestação por Bairro</h5>
          <div className="space-y-2">
            {bairrosInfo.map((bairro, index) => (
              <div key={index} className="flex justify-between items-center">
                <div>{bairro.nome}</div>
                <div className="flex items-center space-x-2">
                  <div className="text-sm">{bairro.indice}%</div>
                  <Badge
                    className={
                      bairro.status === "alto"
                        ? "bg-red-500"
                        : bairro.status === "médio"
                        ? "bg-yellow-500"
                        : "bg-green-500"
                    }
                  >
                    {bairro.status === "alto"
                      ? "Alto risco"
                      : bairro.status === "médio"
                      ? "Médio risco"
                      : "Baixo risco"}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default RankingBairros;
