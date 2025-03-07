
import React from "react";
import { Button } from "@/components/ui/button";
import { Case } from "@/types/case";

interface AudienciasTableProps {
  proximasAudiencias: Case[];
  formatarData: (data?: string) => string;
}

export const AudienciasTable: React.FC<AudienciasTableProps> = ({
  proximasAudiencias,
  formatarData
}) => {
  return (
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
  );
};
