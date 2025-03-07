
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from "recharts";

// Dados de exemplo para os gráficos
const processosPorMes = [
  { name: 'Jan', processos: 4 },
  { name: 'Fev', processos: 3 },
  { name: 'Mar', processos: 5 },
  { name: 'Abr', processos: 7 },
  { name: 'Mai', processos: 2 },
  { name: 'Jun', processos: 6 },
  { name: 'Jul', processos: 8 },
];

const tiposProcessos = [
  { name: 'Trabalhista', value: 35 },
  { name: 'Cível', value: 25 },
  { name: 'Consumidor', value: 20 },
  { name: 'Família', value: 10 },
  { name: 'Outros', value: 10 },
];

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#9146FF'];

export const DashboardCharts: React.FC = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
      <Card>
        <CardHeader>
          <CardTitle>Processos por Mês</CardTitle>
          <CardDescription>
            Novos processos abertos nos últimos meses
          </CardDescription>
        </CardHeader>
        <CardContent className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={processosPorMes}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="processos" fill="#3b82f6" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Tipos de Processos</CardTitle>
          <CardDescription>
            Distribuição por área de atuação
          </CardDescription>
        </CardHeader>
        <CardContent className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={tiposProcessos}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              >
                {tiposProcessos.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
};
