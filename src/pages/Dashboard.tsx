
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Case, CaseFormValues } from "@/types/case";
import { toast } from "sonner";
import { DashboardStats } from "@/components/dashboard/DashboardStats";
import { DashboardCharts } from "@/components/dashboard/DashboardCharts";
import { CasesManagement } from "@/components/dashboard/CasesManagement";

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
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [tipoFilter, setTipoFilter] = useState<string>("all");
  
  // Filtrar próximas audiências
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
    
    if (statusFilter && statusFilter !== "all") {
      filtered = filtered.filter(caso => caso.status === statusFilter);
    }
    
    if (tipoFilter && tipoFilter !== "all") {
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
        
        <DashboardStats casos={casos} proximasAudiencias={proximasAudiencias} />
        
        <DashboardCharts />
        
        <CasesManagement 
          casos={casos}
          setCasos={setCasos}
          filtroCasos={filtroCasos}
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          statusFilter={statusFilter}
          setStatusFilter={setStatusFilter}
          tipoFilter={tipoFilter}
          setTipoFilter={setTipoFilter}
          proximasAudiencias={proximasAudiencias}
          handleAddCase={handleAddCase}
          formatarData={formatarData}
        />
      </div>
    </div>
  );
};

export default Dashboard;
