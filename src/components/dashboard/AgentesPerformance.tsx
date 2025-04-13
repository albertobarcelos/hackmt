
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { DateRange } from "react-day-picker";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Badge } from "@/components/ui/badge";

interface AgentesPerformanceProps {
  dateRange: DateRange;
}

const AgentesPerformance: React.FC<AgentesPerformanceProps> = ({ dateRange }) => {
  // Em uma aplicação real, estes dados viriam da API/banco de dados
  const agentes = [
    { nome: "João Silva", imoveis: 152, depositos: 87, tratados: 75, amostras: 5, eficiencia: 86 },
    { nome: "Maria Oliveira", imoveis: 143, depositos: 92, tratados: 87, amostras: 7, eficiencia: 94 },
    { nome: "Carlos Santos", imoveis: 138, depositos: 79, tratados: 69, amostras: 4, eficiencia: 87 },
    { nome: "Ana Pereira", imoveis: 128, depositos: 65, tratados: 61, amostras: 3, eficiencia: 93 },
    { nome: "Pedro Costa", imoveis: 125, depositos: 71, tratados: 63, amostras: 6, eficiencia: 88 },
    { nome: "Lucia Ferreira", imoveis: 121, depositos: 68, tratados: 58, amostras: 5, eficiencia: 85 },
    { nome: "Roberto Martins", imoveis: 118, depositos: 54, tratados: 51, amostras: 2, eficiencia: 94 },
    { nome: "Fernanda Lima", imoveis: 115, depositos: 62, tratados: 57, amostras: 4, eficiencia: 91 },
  ];

  // Em uma aplicação real, estes dados viriam da API/banco de dados
  const performanceData = agentes.map(agente => ({
    name: agente.nome.split(' ')[0],
    imoveis: agente.imoveis,
    eficiencia: agente.eficiencia,
  }));

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <Card className="md:col-span-2">
        <CardHeader>
          <CardTitle>Desempenho dos Agentes</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[350px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={performanceData}
                margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="name" 
                  angle={-45}
                  textAnchor="end"
                  height={50}  
                />
                <YAxis yAxisId="left" orientation="left" stroke="#8884d8" />
                <YAxis yAxisId="right" orientation="right" stroke="#82ca9d" />
                <Tooltip />
                <Bar yAxisId="left" dataKey="imoveis" name="Imóveis Visitados" fill="#8884d8" />
                <Bar yAxisId="right" dataKey="eficiencia" name="Eficiência (%)" fill="#82ca9d" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Resumo da Equipe</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="bg-muted p-4 rounded-md">
              <div className="text-sm font-medium">Desempenho</div>
              <div className="mt-1 flex justify-between">
                <div>
                  <div className="text-2xl font-bold">8</div>
                  <div className="text-xs text-muted-foreground">Agentes ativos</div>
                </div>
                <div>
                  <div className="text-2xl font-bold">1,243</div>
                  <div className="text-xs text-muted-foreground">Imóveis visitados</div>
                </div>
                <div>
                  <div className="text-2xl font-bold">89%</div>
                  <div className="text-xs text-muted-foreground">Eficiência média</div>
                </div>
              </div>
            </div>
            
            <div>
              <h5 className="text-sm font-semibold mb-2">Agentes por Região</h5>
              <ul className="space-y-1 text-sm">
                <li className="flex justify-between">
                  <span>Centro</span> <Badge variant="outline">2 agentes</Badge>
                </li>
                <li className="flex justify-between">
                  <span>Santa Luzia</span> <Badge variant="outline">2 agentes</Badge>
                </li>
                <li className="flex justify-between">
                  <span>Jardim São Paulo</span> <Badge variant="outline">1 agente</Badge>
                </li>
                <li className="flex justify-between">
                  <span>Vila Nova</span> <Badge variant="outline">2 agentes</Badge>
                </li>
                <li className="flex justify-between">
                  <span>Santo Antônio</span> <Badge variant="outline">1 agente</Badge>
                </li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card className="md:col-span-3">
        <CardHeader>
          <CardTitle>Lista de Agentes</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nome do Agente</TableHead>
                  <TableHead>Imóveis Visitados</TableHead>
                  <TableHead>Depósitos Encontrados</TableHead>
                  <TableHead>Depósitos Tratados</TableHead>
                  <TableHead>Amostras</TableHead>
                  <TableHead>Eficiência</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {agentes.map((agente, i) => (
                  <TableRow key={i}>
                    <TableCell className="font-medium">{agente.nome}</TableCell>
                    <TableCell>{agente.imoveis}</TableCell>
                    <TableCell>{agente.depositos}</TableCell>
                    <TableCell>{agente.tratados}</TableCell>
                    <TableCell>{agente.amostras}</TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        <span
                          className={
                            agente.eficiencia >= 90
                              ? "text-green-500"
                              : agente.eficiencia >= 80
                              ? "text-yellow-500"
                              : "text-red-500"
                          }
                        >
                          {agente.eficiencia}%
                        </span>
                        <div className="ml-2 h-2 w-16 bg-muted rounded-full overflow-hidden">
                          <div
                            className={
                              agente.eficiencia >= 90
                                ? "h-full bg-green-500"
                                : agente.eficiencia >= 80
                                ? "h-full bg-yellow-500"
                                : "h-full bg-red-500"
                            }
                            style={{ width: `${agente.eficiencia}%` }}
                          ></div>
                        </div>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AgentesPerformance;
