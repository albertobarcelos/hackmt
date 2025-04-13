
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import {
  Home,
  Building,
  Truck,
  Map,
  AlertTriangle,
  FlaskConical,
  Droplets,
  Syringe,
  Users,
} from "lucide-react";
import { DateRange } from "react-day-picker";

interface StatusSummaryProps {
  dateRange: DateRange;
}

const StatusSummary: React.FC<StatusSummaryProps> = ({ dateRange }) => {
  // Em uma aplicação real, estes dados viriam da API/banco de dados
  const stats = [
    {
      title: "Imóveis Visitados",
      value: "1,243",
      icon: <Home size={20} className="text-blue-500" />,
      trend: { value: 12.5, isPositive: true },
    },
    {
      title: "Pendências",
      value: "187",
      icon: <AlertTriangle size={20} className="text-yellow-500" />,
      trend: { value: 5.3, isPositive: false },
    },
    {
      title: "Depósitos Tratados",
      value: "683",
      icon: <Droplets size={20} className="text-green-500" />,
      trend: { value: 8.9, isPositive: true },
    },
    {
      title: "Amostras Coletadas",
      value: "42",
      icon: <FlaskConical size={20} className="text-purple-500" />,
      trend: { value: 18.2, isPositive: true },
    },
  ];

  return (
    <div className="grid gap-6 md:grid-cols-4">
      {stats.map((stat, index) => (
        <Card key={index}>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">{stat.title}</p>
                <h3 className="text-2xl font-bold mt-1">{stat.value}</h3>
                <div className="flex items-center mt-2">
                  {stat.trend.isPositive ? (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4 text-green-500 mr-1"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M12 7a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0V8.414l-4.293 4.293a1 1 0 01-1.414 0L8 10.414l-4.293 4.293a1 1 0 01-1.414-1.414l5-5a1 1 0 011.414 0L11 10.586 14.586 7H12z"
                        clipRule="evenodd"
                      />
                    </svg>
                  ) : (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4 text-red-500 mr-1"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M12 13a1 1 0 110 2H7a1 1 0 01-1-1v-5a1 1 0 112 0v2.586l4.293-4.293a1 1 0 011.414 0L16 10.586V8a1 1 0 112 0v5a1 1 0 01-1 1h-5z"
                        clipRule="evenodd"
                      />
                    </svg>
                  )}
                  <span
                    className={
                      stat.trend.isPositive ? "text-green-500 text-xs" : "text-red-500 text-xs"
                    }
                  >
                    {stat.trend.value}%
                  </span>
                  <span className="text-xs text-muted-foreground ml-1">
                    vs semana anterior
                  </span>
                </div>
              </div>
              <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
                {stat.icon}
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default StatusSummary;
