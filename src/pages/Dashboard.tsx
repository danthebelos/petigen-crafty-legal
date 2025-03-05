
import { motion } from "framer-motion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from "recharts";
import { Folder, FileText, Clock, User, Calendar, Activity } from "lucide-react";

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

const proximasAudiencias = [
  { data: '15/08/2023', processo: '0001234-55.2023.8.26.0100', tipo: 'Instrução', cliente: 'João Silva' },
  { data: '18/08/2023', processo: '0002345-66.2023.8.26.0100', tipo: 'Conciliação', cliente: 'Maria Oliveira' },
  { data: '22/08/2023', processo: '0003456-77.2023.8.26.0100', tipo: 'Julgamento', cliente: 'Pedro Santos' },
];

const Dashboard = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-zinc-50 to-white py-8">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-zinc-900">Dashboard</h1>
          <p className="text-zinc-600 mt-2">
            Acompanhe os indicadores do seu escritório de advocacia
          </p>
        </motion.div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total de Processos
              </CardTitle>
              <Folder className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">157</div>
              <p className="text-xs text-muted-foreground">
                +12% em relação ao mês anterior
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Processos Ativos
              </CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">89</div>
              <p className="text-xs text-muted-foreground">
                57% do total de processos
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Prazos Próximos
              </CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">12</div>
              <p className="text-xs text-muted-foreground">
                Nos próximos 7 dias
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Clientes Ativos
              </CardTitle>
              <User className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">64</div>
              <p className="text-xs text-muted-foreground">
                +3 novos este mês
              </p>
            </CardContent>
          </Card>
        </div>
        
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
        
        <div className="grid grid-cols-1 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Próximas Audiências</CardTitle>
                <CardDescription>
                  Audiências agendadas para os próximos dias
                </CardDescription>
              </div>
              <Calendar className="h-5 w-5 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-3 px-4 font-medium text-sm">Data</th>
                      <th className="text-left py-3 px-4 font-medium text-sm">Processo</th>
                      <th className="text-left py-3 px-4 font-medium text-sm">Tipo</th>
                      <th className="text-left py-3 px-4 font-medium text-sm">Cliente</th>
                    </tr>
                  </thead>
                  <tbody>
                    {proximasAudiencias.map((audiencia, i) => (
                      <tr key={i} className="border-b">
                        <td className="py-3 px-4 text-sm">{audiencia.data}</td>
                        <td className="py-3 px-4 text-sm">{audiencia.processo}</td>
                        <td className="py-3 px-4 text-sm">{audiencia.tipo}</td>
                        <td className="py-3 px-4 text-sm">{audiencia.cliente}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
