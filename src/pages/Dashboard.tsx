
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from "recharts";
import { Folder, FileText, Clock, User, Calendar, Activity, Filter, Search } from "lucide-react";
import { AddCaseDialog } from "@/components/AddCaseDialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Case, CaseFormValues } from "@/types/case";
import { toast } from "sonner";

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

// Dados de exemplo para as audiências e processos
const exemploCasos: Case[] = [
  { 
    id: "1", 
    numero: "0001234-55.2023.8.26.0100", 
    tipo: "trabalhista",
    cliente: "João Silva", 
    status: "ativo",
    dataEntrada: "2023-08-01",
    dataAudiencia: "2023-08-15", 
    vara: "2ª Vara do Trabalho", 
    tribunal: "TRT-2"
  },
  { 
    id: "2", 
    numero: "0002345-66.2023.8.26.0100", 
    tipo: "civel",
    cliente: "Maria Oliveira", 
    status: "ativo",
    dataEntrada: "2023-07-20",
    dataAudiencia: "2023-08-18", 
    vara: "5ª Vara Cível", 
    tribunal: "TJSP"
  },
  { 
    id: "3", 
    numero: "0003456-77.2023.8.26.0100", 
    tipo: "consumidor",
    cliente: "Pedro Santos", 
    status: "pendente",
    dataEntrada: "2023-07-15",
    dataAudiencia: "2023-08-22", 
    vara: "3ª Vara do Juizado Especial", 
    tribunal: "TJSP"
  },
];

const Dashboard = () => {
  const [casos, setCasos] = useState<Case[]>(exemploCasos);
  const [filtroCasos, setFiltroCasos] = useState<Case[]>(exemploCasos);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("");
  const [tipoFilter, setTipoFilter] = useState<string>("");
  
  // Calcular estatísticas
  const totalCasos = casos.length;
  const casosAtivos = casos.filter(caso => caso.status === 'ativo').length;
  const proximasAudiencias = casos.filter(caso => 
    caso.dataAudiencia && new Date(caso.dataAudiencia) > new Date()
  ).sort((a, b) => 
    new Date(a.dataAudiencia || "").getTime() - new Date(b.dataAudiencia || "").getTime()
  ).slice(0, 5);
  
  // Filtrar casos
  useEffect(() => {
    let filtered = [...casos];
    
    if (searchTerm) {
      filtered = filtered.filter(caso => 
        caso.numero.toLowerCase().includes(searchTerm.toLowerCase()) ||
        caso.cliente.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    if (statusFilter) {
      filtered = filtered.filter(caso => caso.status === statusFilter);
    }
    
    if (tipoFilter) {
      filtered = filtered.filter(caso => caso.tipo === tipoFilter);
    }
    
    setFiltroCasos(filtered);
  }, [casos, searchTerm, statusFilter, tipoFilter]);
  
  // Adicionar novo caso
  const handleAddCase = (data: CaseFormValues) => {
    const novoCaso: Case = {
      ...data,
      id: (casos.length + 1).toString(),
    };
    
    setCasos([...casos, novoCaso]);
    toast.success("Novo processo adicionado com sucesso!");
  };
  
  // Função para formatar a data para exibição
  const formatarData = (dataString?: string) => {
    if (!dataString) return "-";
    const data = new Date(dataString);
    return data.toLocaleDateString('pt-BR');
  };

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
              <div className="text-2xl font-bold">{totalCasos}</div>
              <p className="text-xs text-muted-foreground">
                Processos cadastrados no sistema
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
              <div className="text-2xl font-bold">{casosAtivos}</div>
              <p className="text-xs text-muted-foreground">
                {Math.round((casosAtivos / totalCasos) * 100)}% do total de processos
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Próximas Audiências
              </CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{proximasAudiencias.length}</div>
              <p className="text-xs text-muted-foreground">
                Nos próximos 30 dias
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
              <div className="text-2xl font-bold">
                {new Set(casos.filter(caso => caso.status === 'ativo').map(caso => caso.cliente)).size}
              </div>
              <p className="text-xs text-muted-foreground">
                Com processos em andamento
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
        
        <Card className="mb-8">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Gestão de Processos</CardTitle>
              <CardDescription>
                Adicione e gerencie seus processos
              </CardDescription>
            </div>
            <AddCaseDialog onAddCase={handleAddCase} />
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row gap-4 mb-6">
              <div className="relative flex-1">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar por número ou cliente..."
                  className="pl-8"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <div className="flex gap-2">
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Filtrar por status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos os status</SelectItem>
                    <SelectItem value="ativo">Ativo</SelectItem>
                    <SelectItem value="arquivado">Arquivado</SelectItem>
                    <SelectItem value="concluido">Concluído</SelectItem>
                    <SelectItem value="pendente">Pendente</SelectItem>
                  </SelectContent>
                </Select>
                
                <Select value={tipoFilter} onValueChange={setTipoFilter}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Filtrar por tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos os tipos</SelectItem>
                    <SelectItem value="trabalhista">Trabalhista</SelectItem>
                    <SelectItem value="civel">Cível</SelectItem>
                    <SelectItem value="consumidor">Consumidor</SelectItem>
                    <SelectItem value="familia">Família</SelectItem>
                  </SelectContent>
                </Select>
                
                <Button variant="outline" size="icon" onClick={() => {
                  setSearchTerm("");
                  setStatusFilter("");
                  setTipoFilter("");
                }}>
                  <Filter className="h-4 w-4" />
                </Button>
              </div>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4 font-medium text-sm">Número</th>
                    <th className="text-left py-3 px-4 font-medium text-sm">Cliente</th>
                    <th className="text-left py-3 px-4 font-medium text-sm">Tipo</th>
                    <th className="text-left py-3 px-4 font-medium text-sm">Status</th>
                    <th className="text-left py-3 px-4 font-medium text-sm">Data Entrada</th>
                    <th className="text-left py-3 px-4 font-medium text-sm">Data Audiência</th>
                    <th className="text-left py-3 px-4 font-medium text-sm">Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {filtroCasos.length > 0 ? (
                    filtroCasos.map((caso) => (
                      <tr key={caso.id} className="border-b hover:bg-zinc-50">
                        <td className="py-3 px-4 text-sm">{caso.numero}</td>
                        <td className="py-3 px-4 text-sm">{caso.cliente}</td>
                        <td className="py-3 px-4 text-sm capitalize">{caso.tipo}</td>
                        <td className="py-3 px-4 text-sm">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            caso.status === 'ativo' ? 'bg-green-100 text-green-800' :
                            caso.status === 'pendente' ? 'bg-yellow-100 text-yellow-800' :
                            caso.status === 'arquivado' ? 'bg-gray-100 text-gray-800' :
                            'bg-blue-100 text-blue-800'
                          }`}>
                            {caso.status === 'ativo' ? 'Ativo' :
                             caso.status === 'pendente' ? 'Pendente' :
                             caso.status === 'arquivado' ? 'Arquivado' : 'Concluído'}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-sm">{formatarData(caso.dataEntrada)}</td>
                        <td className="py-3 px-4 text-sm">{formatarData(caso.dataAudiencia)}</td>
                        <td className="py-3 px-4 text-sm">
                          <Button variant="ghost" size="sm">Detalhes</Button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={7} className="py-6 text-center text-sm text-muted-foreground">
                        Nenhum processo encontrado com os filtros aplicados.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
        
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
                    <th className="text-left py-3 px-4 font-medium text-sm">Cliente</th>
                    <th className="text-left py-3 px-4 font-medium text-sm">Vara/Tribunal</th>
                  </tr>
                </thead>
                <tbody>
                  {proximasAudiencias.length > 0 ? (
                    proximasAudiencias.map((audiencia) => (
                      <tr key={audiencia.id} className="border-b">
                        <td className="py-3 px-4 text-sm">{formatarData(audiencia.dataAudiencia)}</td>
                        <td className="py-3 px-4 text-sm">{audiencia.numero}</td>
                        <td className="py-3 px-4 text-sm">{audiencia.cliente}</td>
                        <td className="py-3 px-4 text-sm">{audiencia.vara || '-'}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={4} className="py-6 text-center text-sm text-muted-foreground">
                        Nenhuma audiência agendada para os próximos dias.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </CardContent>
          <CardFooter className="border-t px-6 py-3">
            <Button variant="outline" size="sm" className="ml-auto">
              Ver todas as audiências
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
