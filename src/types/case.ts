
export interface Case {
  id: string;
  numero: string;
  tipo: string;
  cliente: string;
  status: 'ativo' | 'arquivado' | 'concluido' | 'pendente';
  dataEntrada: string;
  dataAudiencia?: string;
  vara?: string;
  tribunal?: string;
  observacoes?: string;
}

export interface CaseFormValues {
  numero: string;
  tipo: string;
  cliente: string;
  status: 'ativo' | 'arquivado' | 'concluido' | 'pendente';
  dataEntrada: string;
  dataAudiencia?: string;
  vara?: string;
  tribunal?: string;
  observacoes?: string;
}
