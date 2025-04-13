
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
import { FlaskConical } from "lucide-react";

interface LaboratorioSummaryProps {
  dateRange: DateRange;
}

const LaboratorioSummary: React.FC<LaboratorioSummaryProps> = ({ dateRange }) => {
  // Em uma aplicação real, estes dados viriam da API/banco de dados
  const amostrasData = [
    {
      name: "Seg",
      aegypti: 4,
      albopictus: 2,
    },
    {
      name: "Ter",
      aegypti: 6,
      albopictus: 3,
    },
    {
      name: "Qua",
      aegypti: 8,
      albopictus: 5,
    },
    {
      name: "Qui",
      aegypti: 7,
      albopictus: 4,
    },
    {
      name: "Sex",
      aegypti: 9,
      albopictus: 6,
    },
  ];

  // Dados fictícios para um resumo visual de positivos por bairro
  const bairrosPositivos = [
    { nome: "Centro", amostras: 12, positivos: 8 },
    { nome: "Santa Luzia", amostras: 10, positivos: 5 },
    { nome: "Jardim São Paulo", amostras: 8, positivos: 7 },
    { nome: "Vila Nova", amostras: 7, positivos: 3 },
    { nome: "Santo Antônio", amostras: 5, positivos: 2 },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <Card className="md:col-span-2">
        <CardHeader>
          <CardTitle>Amostras Laboratoriais</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[350px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={amostrasData}
                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar
                  dataKey="aegypti"
                  name="Aedes aegypti"
                  fill="#8884d8"
                  stackId="a"
                />
                <Bar
                  dataKey="albopictus"
                  name="Aedes albopictus"
                  fill="#82ca9d"
                  stackId="a"
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
          
          <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-4 flex flex-col items-center justify-center">
                <div className="text-3xl font-bold">42</div>
                <div className="text-xs text-muted-foreground text-center">
                  Total de amostras
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 flex flex-col items-center justify-center">
                <div className="text-3xl font-bold">34</div>
                <div className="text-xs text-muted-foreground text-center">
                  Aedes aegypti
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 flex flex-col items-center justify-center">
                <div className="text-3xl font-bold">20</div>
                <div className="text-xs text-muted-foreground text-center">
                  Aedes albopictus
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 flex flex-col items-center justify-center">
                <div className="text-3xl font-bold">81%</div>
                <div className="text-xs text-muted-foreground text-center">
                  Índice de positividade
                </div>
              </CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Distribuição de Amostras</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div className="bg-muted p-4 rounded-md">
              <h5 className="text-sm font-semibold mb-2">Resumo Laboratorial</h5>
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold">267</div>
                  <div className="text-xs text-muted-foreground">Larvas</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold">78</div>
                  <div className="text-xs text-muted-foreground">Pupas</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold">32</div>
                  <div className="text-xs text-muted-foreground">Adultos</div>
                </div>
              </div>
            </div>
            
            <div>
              <h5 className="text-sm font-semibold mb-2">Amostras por Bairro</h5>
              <div className="space-y-2">
                {bairrosPositivos.map((bairro, index) => (
                  <div key={index} className="flex justify-between items-center">
                    <div className="flex items-center space-x-2">
                      <FlaskConical size={16} className="text-primary" />
                      <span>{bairro.nome}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge variant="outline">{bairro.amostras} amostras</Badge>
                      <Badge
                        variant={bairro.positivos / bairro.amostras > 0.5 ? "destructive" : "secondary"}
                      >
                        {bairro.positivos} positivos
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default LaboratorioSummary;
