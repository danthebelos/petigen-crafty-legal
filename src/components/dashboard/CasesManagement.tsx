
import React from "react";
import { Calendar } from "lucide-react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { AddCaseDialog } from "@/components/AddCaseDialog";
import { CasesTable } from "./CasesTable";
import { AudienciasTable } from "./AudienciasTable";
import { Button } from "@/components/ui/button";
import { Case, CaseFormValues } from "@/types/case";

interface CasesManagementProps {
  casos: Case[];
  setCasos: React.Dispatch<React.SetStateAction<Case[]>>;
  filtroCasos: Case[];
  searchTerm: string;
  setSearchTerm: (value: string) => void;
  statusFilter: string;
  setStatusFilter: (value: string) => void;
  tipoFilter: string;
  setTipoFilter: (value: string) => void;
  proximasAudiencias: Case[];
  handleAddCase: (data: CaseFormValues) => void;
  formatarData: (data?: string) => string;
}

export const CasesManagement: React.FC<CasesManagementProps> = ({
  casos,
  filtroCasos,
  searchTerm,
  setSearchTerm,
  statusFilter,
  setStatusFilter,
  tipoFilter,
  setTipoFilter,
  proximasAudiencias,
  handleAddCase,
  formatarData
}) => {
  return (
    <>
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
          <CasesTable 
            casos={casos}
            filtroCasos={filtroCasos}
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            statusFilter={statusFilter}
            setStatusFilter={setStatusFilter}
            tipoFilter={tipoFilter}
            setTipoFilter={setTipoFilter}
            formatarData={formatarData}
          />
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
          <AudienciasTable 
            proximasAudiencias={proximasAudiencias}
            formatarData={formatarData}
          />
        </CardContent>
        <CardFooter className="border-t px-6 py-3">
          <Button variant="outline" size="sm" className="ml-auto">
            Ver todas as audiências
          </Button>
        </CardFooter>
      </Card>
    </>
  );
};
