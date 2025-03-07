
import React from "react";
import { Button } from "@/components/ui/button";
import { Search, Filter } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Case } from "@/types/case";

interface CasesTableProps {
  casos: Case[];
  filtroCasos: Case[];
  searchTerm: string;
  setSearchTerm: (value: string) => void;
  statusFilter: string;
  setStatusFilter: (value: string) => void;
  tipoFilter: string;
  setTipoFilter: (value: string) => void;
  formatarData: (data?: string) => string;
}

export const CasesTable: React.FC<CasesTableProps> = ({
  filtroCasos,
  searchTerm,
  setSearchTerm,
  statusFilter,
  setStatusFilter,
  tipoFilter,
  setTipoFilter,
  formatarData
}) => {
  return (
    <div>
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
            setStatusFilter("all");
            setTipoFilter("all");
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
    </div>
  );
};
