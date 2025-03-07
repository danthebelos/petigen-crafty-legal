
import React from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Folder, FileText, Clock, User } from "lucide-react";
import { Case } from "@/types/case";

interface DashboardStatsProps {
  casos: Case[];
  proximasAudiencias: Case[];
}

export const DashboardStats: React.FC<DashboardStatsProps> = ({ 
  casos, 
  proximasAudiencias 
}) => {
  // Calcular estatísticas
  const totalCasos = casos.length;
  const casosAtivos = casos.filter(caso => caso.status === 'ativo').length;
  const clientesAtivos = new Set(casos.filter(caso => caso.status === 'ativo').map(caso => caso.cliente)).size;

  return (
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
            {totalCasos > 0 ? Math.round((casosAtivos / totalCasos) * 100) : 0}% do total de processos
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
          <div className="text-2xl font-bold">{clientesAtivos}</div>
          <p className="text-xs text-muted-foreground">
            Com processos em andamento
          </p>
        </CardContent>
      </Card>
    </div>
  );
};
